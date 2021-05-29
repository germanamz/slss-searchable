const getFieldNames = require('./getFieldNames');
const tokenize = require('./tokenize');
const getKeywordFieldNames = require('./getKeywordFieldNames');
const trimValue = require('./trimValue');
const getDataIdKey = require('./getDataIdKey');
const normalizeDynamoScalar = require('./normalizeDynamoScalar');

const tokenizeInstance = (dynamoData) => {
  const dataIdKey = getDataIdKey();
  const { NewImage: newImage = {}, OldImage: oldImage = {}, Keys: keys } = dynamoData;
  const instanceId = normalizeDynamoScalar(keys[dataIdKey]);
  const keywordFieldNames = getKeywordFieldNames(true);
  const fieldNames = getFieldNames();
  const fieldsLength = fieldNames.length;
  const nTokens = {};
  const oTokens = {};

  for (let fieldNameIndex = 0; fieldNameIndex < fieldsLength; fieldNameIndex++) {
    const fieldName = fieldNames[fieldNameIndex];
    const nFieldValue = newImage[fieldName] && normalizeDynamoScalar(newImage[fieldName]);
    const oFieldValue = oldImage[fieldName] && normalizeDynamoScalar(oldImage[fieldName]);

    if (nFieldValue !== oFieldValue) {
      // If the field is a keyword don't tokenize the value
      if (keywordFieldNames[fieldName]) {
        nTokens[trimValue(nFieldValue)] = instanceId
      } else {
        tokenize(nFieldValue, (token) => {
          if (!nTokens[token]) {
            nTokens[token] = instanceId;
          }
        });
        tokenize(oFieldValue, (token) => {
          if (!nTokens[token]) {
            oTokens[token] = instanceId;
          }
        });
      }
    }
  }

  return [
    nTokens,
    oTokens,
  ];
};

module.exports = tokenizeInstance;
