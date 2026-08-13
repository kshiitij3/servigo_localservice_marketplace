import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import path from "path";

export const uploadFile = async (file) => {

  if (!file) {
    throw new ApiError(400, "No file provided");
  }

  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, "File upload service is not configured");
  }

  const extension = path.extname(file.originalname || "").toLowerCase();
  const resourceType = file.mimetype.startsWith("video/") ||
    [".mp4", ".webm", ".mov"].includes(extension)
    ? "video"
    : "image";

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "servigo/work-requests",
        resource_type: resourceType,
      },

      (error, result) => {

        if (error) {
          console.error("Cloudinary upload failed:", {
            message: error.message,
            name: error.name,
            httpCode: error.http_code,
            code: error.code,
            cause: error.cause?.message,
            nestedErrors: error.errors?.map((nestedError) => ({
              code: nestedError.code,
              message: nestedError.message,
              address: nestedError.address,
              port: nestedError.port,
            })),
          });

          return reject(new ApiError(502, "File upload provider failed"));
        }

        if (!result?.secure_url || !result?.public_id) {
          return reject(new ApiError(502, "File upload provider returned an invalid response"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          mediaType: resourceType,
        });

      }
    );

    uploadStream.end(file.buffer);
  });
};
