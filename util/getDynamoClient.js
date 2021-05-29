const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

let instance;

const getDynamoClient = () => {
  if (instance) {
    return instance;
  }
  instance = new DynamoDBClient({});
  return instance;
};

module.exports = getDynamoClient;
