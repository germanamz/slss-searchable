const {
  TOTAL_SEGMENTS = 5,
} = process.env;

const totalSegments = Number(TOTAL_SEGMENTS);

const getTotalSegments = () => totalSegments;

module.exports = getTotalSegments;
