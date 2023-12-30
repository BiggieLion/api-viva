module.exports = (csvData) => {
  let jsonArray = [];

  for (let i = 1; i < csvData.length; i++) {
    jsonArray.push({
      id: csvData[i][0],
      first_name: csvData[i][1],
      last_name: csvData[i][2],
      email: csvData[i][3],
      gender: csvData[i][4],
      ip_address: csvData[i][5],
    });
  }

  return jsonArray;
};
