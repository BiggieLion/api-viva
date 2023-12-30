module.exports = (rawArray) => {
  let cleanArray = [];
  let uniqueObject = {};

  for (let i in rawArray) {
    uniqueObject[rawArray[i]["email"]] = rawArray[i];
  }

  for (let i in uniqueObject) {
    cleanArray.push(uniqueObject[i]);
  }

  return cleanArray;
};
