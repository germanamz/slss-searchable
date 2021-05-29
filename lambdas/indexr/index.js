const { BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const CONSTANTS = require('slss-util/constants');
const tokenizeInstance = require('slss-util/tokenizeInstance');
const getDynamoClient = require('slss-util/getDynamoClient');
const getIdxTable = require('slss-util/getIdxTable');
const getDataIdKey = require('slss-util/getDataIdKey');
const uploadInstanceToS3 = require('slss-util/uploadInstanceToS3');
const normalizeDynamoObject = require('slss-util/normalizeDynamoObject');

const eachToken = (tokens, action) => {
  const tokensArr = Object.keys(tokens);
  const tokensArrLength = tokensArr.length;

  for (let nTokenIndex = 0; nTokenIndex < tokensArrLength; nTokenIndex++) {
    action(tokensArr[nTokenIndex]);
  }
};

const getWriteOperations = (nTokens, oTokens) => {
  const writeOperations = [];
  const toAddCache = {};
  const toRemoveCache = {};

  eachToken(nTokens, (token) => {
    if (!toAddCache[token]) {
      toAddCache[token] = true;
      writeOperations.push({
        PutRequest: {
          Item: {
            [CONSTANTS.TOKEN_ID_KEY]: {
              S: `${token}:${nTokens[token]}`,
            },
            [CONSTANTS.TOKEN_INDEX_KEY]: {
              S: token,
            },
            [CONSTANTS.INSTANCE_INDEX_KEY]: {
              S: nTokens[token],
            },
          },
        },
      });
    }
  });

  eachToken(oTokens, (token) => {
    if (!toRemoveCache[token]) {
      toRemoveCache[token] = true;
      writeOperations.push({
        DeleteRequest: {
          Key: {
            [CONSTANTS.TOKEN_ID_KEY]: {
              S: `${token}:${oTokens[token]}`,
            },
          },
        },
      });
    }
  });

  return writeOperations;
};

const writeChunk = async (writeOperations, numberOfChunks, chunkNumber, timeCap, attempt = 1) => {
  const {
    UnprocessedItems: { [getIdxTable()]: uprocessedItems },
  } = await getDynamoClient().send(new BatchWriteItemCommand({
    RequestItems: {
      [getIdxTable()]: writeOperations,
    },
  }));

  if (uprocessedItems && timeCap > 0) {
    // Do jitter exponential backoff
    const sleep = Math.min(timeCap, Math.floor(Math.random() * numberOfChunks * Math.pow(2, attempt)));

    return new Promise((resolve, reject) =>
      setTimeout(() =>
          writeChunk(uprocessedItems, numberOfChunks, chunkNumber, timeCap - sleep, attempt++)
            .then(() => resolve())
            .catch((e) => reject(e)),
        sleep,
      ));
  }
};

const doWrite = async (writeOperations) => {
  const numberOfChunks = Math.ceil(writeOperations.length / 25);
  const chunkTimeCap = Math.floor(800000 / numberOfChunks);

  let chunkNumber = 0;

  while (chunkNumber < numberOfChunks) {
    const chunk = writeOperations.splice(0, 25);
    await writeChunk(chunk, numberOfChunks, chunkNumber, chunkTimeCap);
    chunkNumber++;
  }
};

const dynamodbToS3 = async (dynamoData) => {
  const { NewImage: nInstance, Keys: keys } = dynamoData;
  if (nInstance) {
    const { [getDataIdKey()]: { S: id} } = keys;
    return uploadInstanceToS3(id, normalizeDynamoObject(nInstance));
  }
};

module.exports.handler = async ({ Records: records }) => {
  const writeOperations = [];

  while (records.length) {
    const record = records.shift();
    let dynamodb;

    if (record.eventSource === 'aws:sqs') {
      dynamodb = JSON.parse(record.body);
    } else {
      ({ dynamodb } = record);
    }
    try {
      writeOperations.push(...getWriteOperations.apply(null, tokenizeInstance(dynamodb)));
      await dynamodbToS3(dynamodb);
    } catch (e) {
      console.log('record with error', JSON.stringify(record));
      console.error(e);
    }
  }

  await doWrite(writeOperations);
};
