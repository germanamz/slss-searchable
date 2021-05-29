const { DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

const CONSTANTS = require('./constants');
const getIdxTable = require('./getIdxTable');
const getDynamoClient = require('./getDynamoClient');

const removeToken = async (tokenId) => {
  await getDynamoClient().send(new DeleteItemCommand({
    TableName: getIdxTable(),
    Key: {
      [CONSTANTS.TOKEN_ID_KEY]: {
        S: tokenId,
      },
    },
  }));
};

const removeTokens = async (tokens, asMap = false) => {
  const keys = Object.keys(tokens);
  const tokensLength = keys.length;

  for (let index = 0; index < tokensLength; index++) {
    const tokenKey = keys[index];
    const tokenId = asMap ? tokens[tokenKey] : tokens[tokenKey][1];
    await removeToken(tokenId);
  }
};

module.exports.removeToken = removeToken;
module.exports.removeTokens = removeTokens;
