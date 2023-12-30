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

    const csvArray = data
      .toString()
      .split("\r\n")
      .map((row) => row.split(","));

    let rawArray = parseCSVtoJSON(csvArray);

    let cleanArray = removeDuplicates(rawArray);

    const rawData = await S3.write(data, `raw_${filename}`, bucket).catch(
      (err) => {
        console.error("Error writing raw file to S3", err);
        return null;
      }
    );

    const cleanArrayData = parseJSONtoCSV(cleanArray);

    const cleanData = await S3.write(
      cleanArrayData,
      `clean_${filename}`,
      bucket
    ).catch((err) => {
      console.error("Error writing clean file to S3", err);
      return null;
    });

    if (!rawData || !cleanData) {
      return HTTP_RESPONSES._500({ message: "Error writing old file to S3" });
    }

    return HTTP_RESPONSES._200({
      message: "File uploaded successfully",
      rawObjectURL: `https://${bucket}.s3.amazonaws.com/raw_${filename}`,
      cleanObjectURL: `https://${bucket}.s3.amazonaws.com/clean_${filename}`,
    });
  } catch (error) {
    return HTTP_RESPONSES._500({ message: error.message, error });
  }
};
