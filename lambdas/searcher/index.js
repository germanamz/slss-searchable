const crypto = require('crypto');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');

const CONSTANTS = require('slss-util/constants');
const tokenize = require('slss-util/tokenize');
const trimValue = require('slss-util/trimValue');
const getFilterKeys = require('slss-util/getFilterKeys');
const getDynamoClient = require('slss-util/getDynamoClient');
const getIdxTable = require('slss-util/getIdxTable');
const getInstanceFromS3 = require('slss-util/getInstanceFromS3');

const getTokenWithSort = async (token, sortField, sortToken, limit, nextToken) => {
  const keyCondition = { [CONSTANTS.TOKEN_INDEX_KEY]: token };
  let indexName = CONSTANTS.TOKEN_INDEX;
  if (sortField && sortToken) {
    keyCondition[`${CONSTANTS.SORT_INDEX_KEY}-${sortField}`] = trimValue(sortToken);
    indexName = `${CONSTANTS.SORT_INDEX}-${sortField}`;
  }
  const filterKeys = getFilterKeys({}, keyCondition);
  const {
    Items: idxItems,
    LastEvaluatedKey: lastEvaluatedKey,
  } = await getDynamoClient().send(new QueryCommand({
    TableName: getIdxTable(),
    IndexName: indexName,
    ExclusiveStartKey: nextToken,
    Limit: limit || 100,
    ...filterKeys,
  }));

  return {
    idxItems,
    lastEvaluatedKey,
  };
};

const getTokenMatches = async (token, sort, limit, nextTokens) => {
  if (sort) {
    const sortFields = Object.keys(sort);
    let idxItems = [];
    const nextTokensMap = nextTokens ? Buffer.from(nextTokens, 'base64').toString('utf8').split(',').reduce((acc, item) => {
      const [field, token64] = item.split(':');
      acc[field] = JSON.parse(Buffer.from(token64, 'base64').toString('utf8'));
      return acc;
    }, {}) : {};
    const lastEvaluatedKeys = [];

    while (sortFields.length) {
      const sortField = sortFields.shift();
      const sortToken = sort[sortField];
      const nextToken = nextTokensMap[sortField];
      const {
        idxItems: resIdxItems,
        lastEvaluatedKey: resLastEvaluatedKey,
      } = await getTokenWithSort(token, sortField, sortToken, limit, nextToken);
      idxItems = idxItems.concat(resIdxItems);
      if (resLastEvaluatedKey) {
        lastEvaluatedKeys.push(`${sortField}:${Buffer.from(JSON.stringify(resLastEvaluatedKey)).toString('base64')}`);
      }
    }

    return {
      idxItems,
      lastEvaluatedKey: lastEvaluatedKeys && lastEvaluatedKeys.length ? Buffer.from(lastEvaluatedKeys.join()).toString('base64') : void 0,
    };
  }
  return getTokenWithSort(token, null, null, limit, nextTokens);
};

module.exports.handler = async (event) => {
  const { arguments: eventArgs } = event;
  const { query, keywords = [], sort, limit: argLimit, nextToken } = eventArgs;
  const limit = argLimit ? argLimit : 100;
  const tokens = query && tokenize(query, false, true);
  const keywordTokens = keywords ? keywords.map(trimValue) : [];
  const queryTokens = [...keywordTokens, ...tokens];
  const searchHash = crypto.createHash('md5').update(`${queryTokens},${JSON.stringify(sort)}`).digest('hex');
  const deduplicationCache = {};

  let currentTokenIndex = 0;
  let lastSearchHash;
  let lastEvaluatedKey;
  let count = 0;
  let currentToken = queryTokens[currentTokenIndex];
  let items = [];

  if (nextToken) {
    ([currentTokenIndex, lastSearchHash, lastEvaluatedKey] = nextToken.split(':'));
    lastEvaluatedKey = JSON.parse(Buffer.from(lastEvaluatedKey, 'base64').toString('utf8'));
    currentTokenIndex = parseInt(currentTokenIndex, 10);
    currentToken = queryTokens[currentTokenIndex];
  }

  if (searchHash !== lastSearchHash) {
    currentTokenIndex = 0;
  }

  while (count < limit && currentToken) {
    const {
      idxItems,
      lastEvaluatedKey: lastEvalKey,
    } = await getTokenMatches(currentToken, sort, limit - count, lastEvaluatedKey);

    while (idxItems.length) {
      const { [CONSTANTS.INSTANCE_INDEX_KEY]: { S: instanceId } } = idxItems.shift();

      if (!deduplicationCache[instanceId]) {
        count = items.push(getInstanceFromS3(instanceId));
        deduplicationCache[instanceId] = true;
      }
    }
    lastEvaluatedKey = lastEvalKey;

    if (!lastEvaluatedKey) {
      if (currentTokenIndex < queryTokens.length) {
        currentTokenIndex += 1;
        currentToken = tokens[currentTokenIndex];
      } else {
        break;
      }
    }
  }

  items = await Promise.all(items);

  return {
    items,
    nextToken: lastEvaluatedKey ? `${currentTokenIndex}:${searchHash}:${Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64')}` : void 0,
  };
};
