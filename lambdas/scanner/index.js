const { ScanCommand } = require('@aws-sdk/client-dynamodb');

const CONSTANTS = require('slss-util/constants');
const getDynamoClient = require('slss-util/getDynamoClient');
const getIdxTable = require('slss-util/getIdxTable');
const getTotalSegments = require('slss-util/getTotalSegments');
const getFilterKeys = require('slss-util/getFilterKeys');
const joinInstances = require('slss-util/joinInstances');

const concurrentSegmentScan = async (filterKeys, segment, limit, acc = [], nextToken) => {
  const res = await getDynamoClient().send(new ScanCommand({
    TableName: getIdxTable(),
    IndexName: CONSTANTS.TOKEN_INDEX,
    ExclusiveStartKey: nextToken,
    Segment: segment,
    TotalSegments: getTotalSegments(),
    ...filterKeys,
  }));
  let {
    Items: idxItems,
    LastEvaluatedKey: lastEvaluatedKey,
  } = res;

  acc.push(...(await joinInstances(idxItems)));

  if (lastEvaluatedKey && acc.length < limit) {
    return concurrentSegmentScan(filterKeys, segment, limit, acc, lastEvaluatedKey);
  }

  return lastEvaluatedKey;
};

module.exports.handler = async (event) => {
  const {
    tokens,
    staticToken,
    limit,
    segment,
    nextToken,
  } = event;
  const or = [];

  if (tokens) {
    or.push({
      [CONSTANTS.TOKEN_INDEX_KEY]: {
        $oneOf: tokens,
      },
    });
  }

  if (staticToken) {
    or.push({
      [CONSTANTS.TOKEN_INDEX_KEY]: staticToken,
    });
  }

  const filterKeys = getFilterKeys({
    $or: or,
  });
  const acc = [];
  const lastEvaluatedKey = await concurrentSegmentScan(filterKeys, segment, limit, acc, nextToken);

  return {
    segment,
    items: acc,
    nextToken: lastEvaluatedKey,
  };
};
