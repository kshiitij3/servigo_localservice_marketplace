import ApiResponse from "../utils/ApiResponse.js";
import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  const statusCode =
    err instanceof multer.MulterError || err.message?.startsWith("Only ")
      ? 400
      : err.statusCode || 500;

  res.status(statusCode).json(
    new ApiResponse(statusCode, err.message || "Internal Server Error")
  );
};

export default errorMiddleware;
