const testObject = require('./fixtures/dynamoObject.json');

const normalizeDynamoObject = require('../normalizeDynamoObject');

describe('Dynamo object normalizer', () => {
  test('Normalize object to the correct form', () => {
    const expectedObject = {
      id: '3da277fe-7bff-4cf5-89ba-bd2a25e79b07',
      NewValue: {
        NewValue1: {
          NewValue2: 0,
          NewValue4: [
            'MQ==',
            true,
            false,
          ],
        },
      },
      NewValue3: [
        [
          [null],
          '11',
        ],
      ],
    };
    const normalizedObject = normalizeDynamoObject(testObject);
    expect(normalizedObject).toEqual(expectedObject);
  });
  test('Normalize object to the correct form with empty values', () => {
    const expectedObject = {
      "id": "04a1370c-bab6-4dc4-96e5-855b10b2093a",
      "__typename": "Product",
      "updatedOn": "2021-04-23T17:07:18.704Z",
      "satUnitId": "21",
      "createdOn": "2021-04-23T17:07:18.704Z",
      "status": "ACTIVE",
      "name": "BROCA MADERA MAX 1X 6 PZ",
      "satCategoryId": "",
      "sku": "IRW14332",
    };
    const normalizedObject = normalizeDynamoObject({
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
      }
    });
    expect(normalizedObject).toEqual(expectedObject);
  });
});
