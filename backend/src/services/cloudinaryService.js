import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, options = {}) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || "products",
                public_id: options.public_id,
                resource_type: "image",
                transformation: options.transformation || [],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });


export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;
    try {
        const res = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
        return res;
    } catch (err) {
        // log and continue
        console.error("Cloudinary destroy error", err);
        return null;
    }
};



export const destroyImage = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    // console.log(`Cloudinary destroy [${publicId}]:`, result.result);
    return result;
  } catch (error) {
    console.error(`Failed to destroy image [${publicId}]:`, error.message);
    // Don't throw — let the caller continue even if one image fails
    return null;
  }
};