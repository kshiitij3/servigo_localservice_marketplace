import ApiResponse from "../utils/ApiResponse.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json(
    new ApiResponse(statusCode, err.message || "Internal Server Error")
  );
};

export default errorMiddleware;