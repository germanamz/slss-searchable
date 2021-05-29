const {
  KEYWORD_FIELDS = '',
} = process.env;

let fieldNames;

const getKeywordFieldNames = (asMap = false) => {
  if (fieldNames) {
    return fieldNames;
  }
  fieldNames = KEYWORD_FIELDS.split(',');
  if (asMap) {
    const fieldNamesLength = fieldNames.length;
    const map = {};
    for (let index = 0; index < fieldNamesLength; index++) {
      const field = fieldNames[index];
      map[field] = true;
    }
    fieldNames = map;
  }
  return fieldNames;
};

module.exports = getKeywordFieldNames;
