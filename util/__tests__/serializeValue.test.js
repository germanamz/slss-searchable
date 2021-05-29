const serializeValue = require('../serializeValue');

describe('Serialize object for dynamo', () => {
  test('Serialize object', () => {
    const expectedObject = {
      "id": {
        "S": "04a1370c-bab6-4dc4-96e5-855b10b2093a"
      },
      "__typename": {
        "S": "Product"
      },
      "updatedOn": {
        "S": "2021-04-23T17:07:18.704Z"
      },
      "satUnitId": {
        "S": "21"
      },
      "createdOn": {
        "S": "2021-04-23T17:07:18.704Z"
      },
      "status": {
        "S": "ACTIVE"
      },
      "name": {
        "S": "BROCA MADERA MAX 1X 6 PZ"
      },
      "satCategoryId": {
        "S": ""
      },
      "sku": {
        "S": "IRW14332"
      },
      "num": {
        "N": "1"
      }
    };
    const normalizedObject = serializeValue({
      "id": "04a1370c-bab6-4dc4-96e5-855b10b2093a",
      "__typename": "Product",
      "updatedOn": "2021-04-23T17:07:18.704Z",
      "satUnitId": "21",
      "createdOn": "2021-04-23T17:07:18.704Z",
      "status": "ACTIVE",
      "name": "BROCA MADERA MAX 1X 6 PZ",
      "satCategoryId": "",
      "sku": "IRW14332",
      "num": 1,
    });
    expect(normalizedObject).toEqual(expectedObject);
  });
});
