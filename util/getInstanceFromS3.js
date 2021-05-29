const { GetObjectCommand } = require('@aws-sdk/client-s3');

const getDataBucket = require('./getDataBucket');
const getDataTable = require('./getDataTable');
const getS3Client = require('./getS3Client');

module.exports = async (id) => {
  const objectData = [];
  const { Body: stream } = await getS3Client().send(new GetObjectCommand({
    Bucket: getDataBucket(),
    Key: `${getDataTable()}/${id}`,
  }));

  return new Promise((resolve, reject) => {
    stream.on('error', (e) => reject(e));
    stream.on('data', (chunk) => objectData.push(chunk));
    stream.on('end', () => resolve(JSON.parse(Buffer.concat(objectData).toString())));
  });
};
