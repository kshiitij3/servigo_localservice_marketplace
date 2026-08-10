import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp4",
    ".webm",
    ".mov",
  ];

  const extension = path.extname(file.originalname || "").toLowerCase();
  const hasAllowedMimeType = allowedMimeTypes.includes(file.mimetype);
  const hasAllowedExtension = allowedExtensions.includes(extension);

  // Some clients send image/video files as application/octet-stream or omit
  // the MIME type. The extension still lets us validate the intended format.
  if (hasAllowedMimeType || hasAllowedExtension) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP images and MP4, WEBM, MOV videos are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter,
});

export default upload;
