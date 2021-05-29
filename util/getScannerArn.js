const {
  SCANNER_ARN,
} = process.env;

const getScannerArn = () => SCANNER_ARN;

module.exports = getScannerArn;
