const parser = require("json2csv");

module.exports = (jsonArray) => {
  const fields = Object.keys(jsonArray[0]);

  return parser.parse(jsonArray, { fields });
};
