const serializeValue = require('./serializeValue');

const isScalar = (val) => (val instanceof Date) || (val && !!val.B) || typeof val !== 'object';

const eq = (key, value, setExpAttrValue, setExpAttrName) => {
  const expKey = setExpAttrName(key);
  const expressionKey = setExpAttrValue(`:${key}`, serializeValue(value));
  return `${expKey} = ${expressionKey}`;
};

const oneOf = (key, items, setExpAttrValue, setExpAttrName) => {
  const expKey = setExpAttrName(key);
  let expression = `${expKey} IN (`;
  const itemsLength = items.length;
  for (let itemIndex = 0; itemIndex < itemsLength; itemIndex++) {
    const item = items[itemIndex];
    const itemExp = setExpAttrValue(`:${key}${itemIndex}`, serializeValue(item));
    expression += itemExp;

    if (itemIndex < itemsLength - 1) {
      expression += ',';
    }
  }
  return expression + ')';
};

const filterJoiner = (glue) => (filters, setExpAttrValue, setExpAttrName) => {
  let expression = '';
  const filtersLength = filters.length;

  for (let fIndex = 0; fIndex < filtersLength; fIndex++) {
    const filter = filters[fIndex];
    expression += serializeFilter(filter, setExpAttrValue, setExpAttrName);
    if (fIndex < filtersLength - 1) {
      expression += glue;
    }
  }

  if (filtersLength > 1) {
    expression = `(${expression})`;
  }

  return expression;
};

const and = filterJoiner(' AND ');

const or = filterJoiner(' OR ');

const serializeFilter = (filter, setExpAttrValue, setExpAttrName, joinWithOr = false) => {
  let filterExpression = '';
  const glue = joinWithOr ? ' OR ' : ' AND ';
  const filterKeys = Object.keys(filter);
  const filterKeysLength = filterKeys.length;

  for (let keyIndex = 0; keyIndex < filterKeysLength; keyIndex++) {
    const key = filterKeys[keyIndex];
    const keyValue = filter[key];

    if (key === '$and') {
      filterExpression += and(keyValue, setExpAttrValue, setExpAttrName);
    } else if (key === '$or') {
      filterExpression += or(keyValue, setExpAttrValue, setExpAttrName);
    } else if (isScalar(keyValue)) {
      filterExpression += eq(key, keyValue, setExpAttrValue, setExpAttrName);
    } else if (Array.isArray(keyValue.$oneOf)) {
      filterExpression += oneOf(key, keyValue.$oneOf, setExpAttrValue, setExpAttrName);
    }

    if (keyIndex < filterKeysLength - 1) {
      filterExpression += glue;
    }
  }

  return filterExpression;
};

const getFilterKeys = (filter, queryKeyCondition = {}) => {
  if (!filter && !queryKeyCondition) {
    return {};
  }

  const res = {};
  const expressionAttributeNames = {};
  const setExpAttrName = (key) => {
    const hKey = `#${key}`;
    if (!expressionAttributeNames[hKey]) {
      expressionAttributeNames[hKey] = key;
    }
    return hKey;
  };
  let expressionAttributeValues = {};
  const setExpAttrValues = (key, value) => {
    if (!expressionAttributeValues[key]) {
      expressionAttributeValues[key] = value;
      return key;
    }
    let nKey = `${key}${Math.floor(Math.random() * 1000)}`
    expressionAttributeValues[nKey] = value;
    return nKey;
  };
  const filterExpression = serializeFilter(filter, setExpAttrValues, setExpAttrName);
  const keyConditionExpression = serializeFilter(queryKeyCondition, setExpAttrValues, setExpAttrName);

  if (keyConditionExpression.length) {
    res['KeyConditionExpression'] = keyConditionExpression;
  }
  if (filterExpression.length) {
    res['FilterExpression'] = filterExpression;
  }
  if (Object.keys(expressionAttributeValues).length) {
    res['ExpressionAttributeValues'] = expressionAttributeValues;
  }
  if (Object.keys(expressionAttributeNames).length) {
    res['ExpressionAttributeNames'] = expressionAttributeNames;
  }
  return res;
};

module.exports = getFilterKeys;
