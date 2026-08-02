import ApiError from "../utils/ApiError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not authorized to access this resource"
      );
    }

    next();
  };
};