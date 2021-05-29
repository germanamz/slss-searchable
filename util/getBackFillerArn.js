const {
  AWS_LAMBDA_FUNCTION_NAME,
} = process.env;

const getIndexrArn = () => AWS_LAMBDA_FUNCTION_NAME;

module.exports = getIndexrArn;
