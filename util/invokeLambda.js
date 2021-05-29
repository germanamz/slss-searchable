const { InvokeCommand } = require('@aws-sdk/client-lambda');

const getLambdaClient = require('./getLambdaClient');

const invokeLambda = async (functionName, payload, invocationType = 'RequestResponse') => {
  const { Payload: payloadResponse } = await getLambdaClient().send(new InvokeCommand({
    FunctionName: functionName,
    Payload: Uint8Array.from(Buffer.from(JSON.stringify(payload))),
    InvocationType: invocationType,
  }));

  if (!payloadResponse || !payloadResponse.length) {
    return null;
  }

  return JSON.parse(Buffer.from(payloadResponse).toString());
};

module.exports = invokeLambda;
