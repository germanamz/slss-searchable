module.exports = {
  "Records": [
    {
      "eventID": "e6c1c0fa074a890afa01d9ebaa77c7d6",
      "eventName": "MODIFY",
      "eventVersion": "1.1",
      "eventSource": "aws:dynamodb",
      "awsRegion": "us-east-1",
      "dynamodb": {
        "ApproximateCreationDateTime": 1620761625,
        "Keys": {
          "id": {
            "S": "466efd3c-6c26-459b-a8b0-8bf94263c203"
          }
        },
        "NewImage": {
          "description": {
            "S": "Thinner americano del bueno con otra descripcion"
          },
          "id": {
            "S": "466efd3c-6c26-459b-a8b0-8bf94263c203"
          },
          "sku": {
            "S": "SOL012-3"
          }
        },
        "OldImage": {
          "description": {
            "S": "Thinner americano del bueno"
          },
          "id": {
            "S": "466efd3c-6c26-459b-a8b0-8bf94263c203"
          },
          "sku": {
            "S": "SOL012-3"
          }
        },
        "SequenceNumber": "1800000000079515569531",
        "SizeBytes": 233,
        "StreamViewType": "NEW_AND_OLD_IMAGES"
      },
      "eventSourceARN": "arn:aws:dynamodb:us-east-1:111111111:table/table-name/stream/2021-01-01T00:00:00.000"
    }
  ]
};
