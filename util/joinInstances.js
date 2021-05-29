const { BatchGetItemCommand } = require('@aws-sdk/client-dynamodb');

const CONSTANTS = require('./constants');
const getDataTable = require('./getDataTable');
const getDynamoClient = require('./getDynamoClient');
const normalizeDynamoObject = require('./normalizeDynamoObject');
const getDataIdKey = require('./getDataIdKey');

const backOffBase = Math.floor(Math.random() * 1000) - 1000;

const sleep = async (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const getInstances = async (keys, attempt = 0) => {
  let keysToGet = keys;
  const items = [];

  do {
    const {
      Responses: { [getDataTable()]: dataItems },
      UnprocessedKeys: { [getDataTable()]: unprocessedKeys },
    } = await getDynamoClient().send(new BatchGetItemCommand({
      RequestItems: {
        [getDataTable()]: {
          Keys: keysToGet,
        },
      },
    }));
    const normalizedDataItems = dataItems.map(normalizeDynamoObject);
    items.push(...normalizedDataItems);

    if (unprocessedKeys) {
      keysToGet = unprocessedKeys;
      const sleepTime = Math.min(3000, Math.floor(backOffBase * Math.pow(2, attempt)));
      await sleep(sleepTime);
    }
  } while (keysToGet);

  return items;
};

const joinInstances = async (idxItems) => {
  if (!idxItems || !idxItems.length) {
    return [];
  }
  const keys = idxItems.map((idxItem) => ({
    [getDataIdKey()]: idxItem[CONSTANTS.INSTANCE_INDEX_KEY],
  }));

  return getInstances(keys);
};

module.exports = joinInstances;
