import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloud.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

const uploadToCloudinary = (imgBuffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result from Cloudinary'));
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(imgBuffer).pipe(stream);
  });
};

const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const lastPart = parts.pop();
    const [publicId] = lastPart.split('.');
    const folderPath = parts.slice(parts.indexOf('upload') + 1).join('/');
    return `${folderPath}/${publicId}`;
  } catch (err) {
    return null;
  }
};

const deleteFromCloudinary = async (url) => {
  const public_id = extractPublicId(url);
  if (!public_id) {
    throw new Error('Invalid URL');
  }
  const result = await cloudinary.uploader.destroy(public_id);
  return result;
};

export { upload, uploadToCloudinary, deleteFromCloudinary };
