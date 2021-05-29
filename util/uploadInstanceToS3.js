const { Upload } = require('@aws-sdk/lib-storage');

const getDataBucket = require('./getDataBucket');
const getDataTable = require('./getDataTable');
const getS3Client = require('./getS3Client');

module.exports = async (id, obj) => {
  const buffer = Buffer.from(JSON.stringify(obj));
  const upload = new Upload({
    client: getS3Client(),
    params: {
      Key: `${getDataTable()}/${id}`,
      Bucket: getDataBucket(),
      Body: buffer,
    },
  });
  return upload.done();
};
