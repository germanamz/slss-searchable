const normalizeDynamoScalar = require('./normalizeDynamoScalar');

const normalizer = (dObj) => {
  const obj = Array.isArray(dObj) ? [] : {};
  const keys = Object.keys(dObj);

  while (keys.length) {
    const key = keys.shift();
    const value = dObj[key];
    if (value.M) {
      obj[key] = normalizer(value.M);
    } else if (value.L) {
      obj[key] = normalizer(value.L);
    } else {
      obj[key] = normalizeDynamoScalar(value);
    }
  }

  return obj;
};

module.exports = normalizer;
