const cloudinary = require("./cloudinary");

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "recipad/recipes",
        resource_type: "image",
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }

        resolve({
          url: res.secure_url,
          publicId: res.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });

module.exports = uploadToCloudinary;
