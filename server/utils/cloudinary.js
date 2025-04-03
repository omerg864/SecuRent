import cloudinary from '../config/cloud.js';
import streamifier from "streamifier";

export const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const lastPart = parts.pop(); 
    const [fileName] = lastPart.split('.');
    const uploadIndex = parts.indexOf('upload');
    const folderPath = parts.slice(uploadIndex + 2).join('/');

    return `${folderPath}/${fileName}`;
    
  } catch (err) {
    return null;
  }
};


export const deleteImage = async (url, throwOnFail = false) => {
  const public_id = extractPublicId(url);
  if (!public_id) {
    const msg = "Invalid Cloudinary URL";
    if (throwOnFail) throw new Error(msg);
    console.error(msg);
    return;
  }
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    if (throwOnFail) throw new Error("Failed to delete image");
    console.error("Image deletion failed:", err);
  }
};
