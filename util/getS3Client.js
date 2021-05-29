const { S3Client } = require('@aws-sdk/client-s3');

let instance;

const getS3Client = () => {
  if (instance) {
    return instance;
  }
  instance = new S3Client({});
  return instance;
};

module.exports = getS3Client;
