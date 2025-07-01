// utils/fileUploader.js
const cloudinary = require('./cloudinary');
const fs = require('fs');

const supportedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];

const isFileTypeSupported = (ext) => {
  return supportedTypes.includes(ext.toLowerCase());
};

const uploadToCloudinary = async (file, folder) => {
  const options = {
    folder,
    resource_type: "auto",
  };

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);

    
    fs.unlinkSync(file.tempFilePath);

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};

module.exports = { uploadToCloudinary, isFileTypeSupported };
