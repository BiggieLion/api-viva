const AWS = require("aws-sdk");

const s3Client = new AWS.S3();

const S3 = {
  async get(fileName, bucket) {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    let data = await s3Client.getObject(params).promise();

    if (!data) {
      throw Error(`There was an error getting ${fileName} from ${bucket}`);
    }

    if (fileName.slice(fileName.length - 4, fileName.length) === "json") {
      data = data.Body.toString();
    }

    return data;
  },

  async getReadStream(fileName, bucket) {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    const data = await s3Client.getObject(params).createReadStream();

    if (!data) {
      throw Error(`There was an error getting ${fileName} from ${bucket}`);
    }

    return data;
  },

  async write(data, fileName, bucket) {
    const params = {
      Bucket: bucket,
      Body: data,
      ContentType: "text/csv",
      Key: fileName,
    };

    const newData = await s3Client.putObject(params).promise();

    if (!newData) {
      throw Error("There was an error writing the file");
    }

    return newData;
  },

  async verify(filename, bucket) {
    const params = {
      Bucket: bucket,
      Key: filename,
    };

    s3Client.headObject(params, function (err, metadata) {
      if (err) {
        console.error("Error on headObject", err);
        if (err.name === "NotFound") {
          return 0;
        } else {
          return -1;
        }
      } else {
        return 1;
      }
    });
  },
};

module.exports = S3;
