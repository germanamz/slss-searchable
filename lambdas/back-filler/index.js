const { SendMessageBatchCommand } = require('@aws-sdk/client-sqs');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');

const getDynamoClient = require('slss-util/getDynamoClient');
const getSqsClient = require('slss-util/getSqsClient');
const getBackFillQueueUrl = require('slss-util/getBackFillQueueUrl');
const getDataTable = require('slss-util/getDataTable');
const getDataIdKey = require('slss-util/getDataIdKey');
const getInstanceFromS3 = require('slss-util/getInstanceFromS3');
const normalizeDynamoScalar = require('slss-util/normalizeDynamoScalar');
const serializeValue = require('slss-util/serializeValue');

const generateEntryFactory = (groupId) => async function (item, index) {
  const record = {
    Keys: {
      [getDataIdKey()]: item[getDataIdKey()],
    },
    NewImage: {
      ...item,
    },
  };
  try {
    const instance = await getInstanceFromS3(normalizeDynamoScalar(item[getDataIdKey()]));
    record.OldImage = serializeValue(instance);
  } catch (e) {
    console.error(e);
  }
  const recordStr = JSON.stringify(record);
  const recordHash = crypto.createHash('md5').update(recordStr).digest('hex');

  return {
    Id: index,
    MessageBody: recordStr,
    MessageDeduplicationId: recordHash,
    MessageGroupId: groupId,
  };
};

const scanDataTable = async (groupId, nextToken) => {
  const {
    Items: items,
    LastEvaluatedKey: lastEvaluatedKey,
  } = await getDynamoClient().send(new ScanCommand({
    TableName: getDataTable(),
    ExclusiveStartKey: nextToken,
  }));

  const chunkSize = 10;
  const sqsClient = getSqsClient();
  const generateEntry = generateEntryFactory(groupId);

  while (items.length) {
    const entries = await Promise.all(items.splice(0, chunkSize).map(generateEntry));
    await sqsClient.send(new SendMessageBatchCommand({
      QueueUrl: getBackFillQueueUrl(),
      Entries: entries,
    }));
  }

  if (lastEvaluatedKey) {
    return scanDataTable(groupId, lastEvaluatedKey);
  }
};

module.exports.handler = async () =>
  scanDataTable(`${Math.ceil(Math.random() * 1000)}-${Math.ceil(Math.random() * 1000)}-${Math.ceil(Math.random() * 1000)}`);
