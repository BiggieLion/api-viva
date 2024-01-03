const HTTP_RESPONSES = require("./utils/API.responses");
const S3 = require("./utils/S3.util");
const extractFile = require("./utils/extractFile");
const parseCSVtoJSON = require("./utils/parseCSVtoJSON");
const removeDuplicates = require("./utils/deleteDuplicates");
const parseJSONtoCSV = require("./utils/parseJSONtoCSV");

const bucket = process.env.bucketName;

module.exports.handler = async (event) => {
  try {
    const { filename, data } = extractFile(event);

    let rawFilename = `raw_${filename}`;
    let cleanFilename = `clean_${filename}`;

    const csvArray = data
      .toString()
      .split("\r\n")
      .map((row) => row.split(","));

    let rawArray = parseCSVtoJSON(csvArray);

    const rawCSV = parseJSONtoCSV(rawArray);

    let cleanArray = removeDuplicates(rawArray);

    const cleanArrayData = parseJSONtoCSV(cleanArray);

    if (S3.verify(rawFilename, bucket) == 1) {
      rawFilename = `${new Date().toLocaleDateString()}_${rawFilename}`;
    }

    if (S3.verify(cleanFilename, bucket) == 1) {
      cleanFilename = `${new Date().toLocaleDateString()}_${cleanFilename}`;
    }

    const rawData = await S3.write(rawCSV, rawFilename, bucket).catch((err) => {
      console.error("Error writing raw file to S3", err);
      return null;
    });

    const cleanData = await S3.write(
      cleanArrayData,
      cleanFilename,
      bucket
    ).catch((err) => {
      console.error("Error writing clean file to S3", err);
      return null;
    });

    if (!rawData || !cleanData) {
      return HTTP_RESPONSES._500({ message: "Error writing old file to S3" });
    }

    return HTTP_RESPONSES._any(201, {
      message: "File uploaded successfully",
      rawFilename,
      cleanFilename,
    });
  } catch (error) {
    return HTTP_RESPONSES._500({ message: error.message, error });
  }
};
