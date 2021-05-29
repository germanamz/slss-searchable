const {
  BACK_FILL_QUEUE_URL,
} = process.env;

const getBackFillQueueUrl = () => BACK_FILL_QUEUE_URL;

module.exports = getBackFillQueueUrl;
