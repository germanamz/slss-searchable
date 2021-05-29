const serializeScalarValue = (val) => {
  if (val === null) {
    return { NULL: true };
  }

  if (val instanceof Date) {
    return {
      S: val.toISOString(),
    };
  }

  if (typeof val === 'boolean') {
    return { BOOL: val };
  }

  if (typeof val === 'number') {
    return {
      N: `${val}`,
    };
  }

  return {
    S: val,
  };
};

const serializeValue = (val) => {
  if (Array.isArray(val)) {
    return {
      L: val.map(serializeValue),
    };
  }

  if (val.B) {
    return val;
  }

  if (typeof val === 'object') {
    return {
      M: Object
        .keys(val)
        .reduce((acc, key) => {
          acc[key] = serializeValue(val[key]);
          return acc;
        }, {}),
    };
  }

  return serializeScalarValue(val);
};

const serializeObject = (val) => {
  if (val && typeof val === 'object') {
    return Object
      .keys(val)
      .reduce((acc, key) => {
        acc[key] = serializeValue(val[key]);
        return acc;
      }, Array.isArray(val) ? [] : {});
  }

  return serializeValue(val);
}

module.exports = serializeObject;
