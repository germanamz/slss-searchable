const { SQSClient } = require('@aws-sdk/client-sqs');

let instance;

const getSqsClient = () => {
  if (instance) {
    return instance;
  }
  instance = new SQSClient({});
  return instance;
};

module.exports = getSqsClient;
