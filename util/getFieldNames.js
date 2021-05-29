const {
  FIELDS,
} = process.env;

let fieldNames;

const getFieldNames = () => {
  if (fieldNames) {
    return fieldNames;
  }
  fieldNames = FIELDS.split(',');
  return fieldNames;
};

module.exports = getFieldNames;
