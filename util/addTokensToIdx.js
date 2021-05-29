const { BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const CONSTANTS = require('./constants');
const getDynamoClient = require('./getDynamoClient');
const getIdxTable = require('./getIdxTable');

const addTokenToIdx = async (token, instanceId) => {
  await getDynamoClient().send(new BatchWriteItemCommand({
    TableName: getIdxTable(),
    Item: {
      [CONSTANTS.TOKEN_ID_KEY]: {
        S: uuidv4(),
      },
      [CONSTANTS.TOKEN_INDEX_KEY]: {
        S: token,
      },
      [CONSTANTS.INSTANCE_INDEX_KEY]: {
        S: instanceId,
      },
    },
  }));
};

module.exports = addTokenToIdx;
