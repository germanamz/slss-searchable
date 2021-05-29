const normalizeDynamoScalar = require('./normalizeDynamoScalar');
const CONSTANTS = require('./constants');

const normalizeDynamoTokens = (dItems, asMap = false) => {
  const tokens = asMap ? {} : [];
  const dItemsLength = dItems.length;

  for (let dItemIndex = 0; dItemIndex < dItemsLength; dItemIndex++) {
    const tokenId = normalizeDynamoScalar(dItems[dItemIndex][CONSTANTS.TOKEN_ID_KEY]);
    const token = normalizeDynamoScalar(dItems[dItemIndex][CONSTANTS.TOKEN_INDEX_KEY]);
    if (asMap) {
      tokens[token] = tokenId;
    } else {
      tokens.push([token, tokenId]);
    }
  }

  return tokens;
};

module.exports = normalizeDynamoTokens;
