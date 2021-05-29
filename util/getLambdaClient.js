const { LambdaClient } = require('@aws-sdk/client-lambda');

let instance;

const getLambdaClient = () => {
  if (instance) {
    return instance;
  }
  instance = new LambdaClient({});
  return instance;
};

module.exports = getLambdaClient;
