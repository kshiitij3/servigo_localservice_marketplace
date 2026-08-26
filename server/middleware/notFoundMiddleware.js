import ApiError from "../utils/ApiError.js";

const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundMiddleware;
