const CONSTANTS = require('./constants');
const getInstanceFromS3 = require('./getInstanceFromS3');

const getInstances = async (idxItems) => {
  const items = [];

  while (idxItems.length) {
    const { [CONSTANTS.INSTANCE_INDEX_KEY]: { S: instanceId } } = idxItems.shift();
    const instance = await getInstanceFromS3(instanceId);

    items.push(instance);
  }

  return items;
};

const joinInstances = async (idxItems) => {
  if (!idxItems || !idxItems.length) {
    return [];
  }

  return getInstances(idxItems);
};

module.exports = joinInstances;
