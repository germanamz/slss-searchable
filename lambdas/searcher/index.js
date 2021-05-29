const crypto = require('crypto');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');

const CONSTANTS = require('slss-util/constants');
const tokenize = require('slss-util/tokenize');
const trimValue = require('slss-util/trimValue');
const getFilterKeys = require('slss-util/getFilterKeys');
const getDynamoClient = require('slss-util/getDynamoClient');
const getIdxTable = require('slss-util/getIdxTable');
const getInstanceFromS3 = require('slss-util/getInstanceFromS3');

const getTokenMatches = async (token, limit, nextToken) => {
  const {
    Items: idxItems,
    LastEvaluatedKey: lastEvaluatedKey,
  } = await getDynamoClient().send(new QueryCommand({
    TableName: getIdxTable(),
    IndexName: CONSTANTS.TOKEN_INDEX,
    ExclusiveStartKey: nextToken,
    Limit: limit,
    ...(getFilterKeys({}, { token })),
  }));

  return {
    idxItems,
    lastEvaluatedKey,
  };
};

module.exports.handler = async (event) => {
  const { arguments: eventArgs } = event;
  const { query, keywords = [], limit, nextToken } = eventArgs;
  const tokens = query && tokenize(query, false, true);
  const keywordTokens = keywords.map(trimValue);
  const queryTokens = [...keywordTokens, ...tokens];
  const searchHash = crypto.createHash('md5').update(queryTokens.join()).digest('hex');
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
    } = await getTokenMatches(currentToken, limit - count, lastEvaluatedKey);

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
