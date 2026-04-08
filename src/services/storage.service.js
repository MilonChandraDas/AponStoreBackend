const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env.IMAGE_KIT,
});

const uploadImage = async (file) => {
  const result = await client.files.upload({
    file,
    fileName: "product_" + Date.now(),
    folder: "products",
  });
  return result;
};

module.exports = uploadImage;
