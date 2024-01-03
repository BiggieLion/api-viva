const S3 = require("./S3.util");
const parser = require("csvtojson");

module.exports = async (filename, bucket) => {
  const csvStream = await S3.getReadStream(filename, bucket);

  return await parser().fromStream(csvStream);
};
