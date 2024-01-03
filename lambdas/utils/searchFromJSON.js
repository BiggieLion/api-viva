module.exports = (key, value, jsonObj) => {
  return jsonObj.filter((obj) => obj[key] === value);
};
