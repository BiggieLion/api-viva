const BUCKET = process.env.bucketName;
const S3 = require("./utils/S3.util");
const RESPONSES = require("./utils/API.responses");
const getCSVfromS3 = require("./utils/getCSVfromS3");
const searchFromJSON = require("./utils/searchFromJSON");
const keysVerifier = require("./utils/keysVerifier");

module.exports.handler = async (event) => {
  try {
    const { filename, key, value } = event.queryStringParameters;

    if (S3.verify(filename, BUCKET) == 0) {
      return RESPONSES._any({ message: "File not found" });
    }

    const jsonArray = await getCSVfromS3(filename, BUCKET);

    if (!keysVerifier(jsonArray[0], key)) {
      return RESPONSES._400({ message: "Invalid keys" });
    }

    const result = searchFromJSON(key, value, jsonArray);

    if (result.length === 0) {
      return RESPONSES._any(404, { message: "Not users data found" });
    }

    return RESPONSES._200({ message: "Users matched", key, value, result });
  } catch (error) {
    return RESPONSES._500({
      esp: "Ha ocurrido un error",
      error,
      message: error.message,
    });
  }
};
