module.exports = (jsonArray) => {
  const headers = Object.keys(jsonArray[0]);
  const replacer = (key, value) => (value === null ? "" : value);

  const csvString = [
    headers.join(","),
    ...jsonArray.map((row) =>
      headers
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  return csvString;
};
