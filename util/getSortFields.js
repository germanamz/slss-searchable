const {
  SORT_FIELDS,
} = process.env;

let fieldNames;
let fieldNamesMap;

const getSortFields = (asMap) => {
  if (asMap && fieldNamesMap) {
    return fieldNamesMap;
  }
  if (!asMap && fieldNames) {
    return fieldNames;
  }
  fieldNames = SORT_FIELDS.split(',');
  if (asMap) {
    const fieldNamesLength = fieldNames.length;
    const map = {};
    for (let index = 0; index < fieldNamesLength; index++) {
      const field = fieldNames[index];
      map[field] = true;
    }
    fieldNamesMap = map;
  }
  return fieldNames;
};

module.exports = getSortFields;
