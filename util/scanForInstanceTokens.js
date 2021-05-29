const { ScanCommand } = require('@aws-sdk/client-dynamodb');

const getFilterKeys = require('./getFilterKeys');
const getDynamoClient = require('./getDynamoClient');
const getIdxTable = require('./getIdxTable');
const normalizeDynamoTokens = require('./normalizeDynamoTokens');
const CONSTANTS = require('./constants');

const recursiveScan = async (instanceId, asMap = false, exclusiveStartKey) => {
  const filterKeys = getFilterKeys({
    instanceId: (Array.isArray(instanceId) ? { $oneOf: instanceId } : instanceId),
  });
  const { Items: items, LastEvaluatedKey: lastEvaluatedKey } = await getDynamoClient().send(new ScanCommand({
    TableName: getIdxTable(),
    IndexName: CONSTANTS.INSTANCE_INDEX,
    ExclusiveStartKey: exclusiveStartKey,
    ...filterKeys,
  }));
  const instanceTokens = normalizeDynamoTokens(items, asMap);

  if (lastEvaluatedKey) {
    Object.assign(instanceTokens, await scanForInstanceTokens(instanceId, asMap, lastEvaluatedKey));
  }

  return instanceTokens;
};

const scanForInstanceTokens = async (instanceId, asMap = false) => recursiveScan(instanceId, asMap);

module.exports = scanForInstanceTokens;
