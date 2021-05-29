const normalizeDynamoScalar = (value) => {
  if (value.N) {
    return Number(value.N);
  } else if (typeof value.S === 'string') {
    return value.S;
  } else if (value.B) {
    return value.B;
  } else if ('BOOL' in value) {
    return value.BOOL;
  } else if (value.NULL) {
    // Dynamo NULL type is a flag
    return null;
  }
  return value;
};

module.exports = normalizeDynamoScalar;
