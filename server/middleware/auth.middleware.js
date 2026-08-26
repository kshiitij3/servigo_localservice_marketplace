import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Please login to continue");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(
      401,
      error.name === "TokenExpiredError"
        ? "Token has expired"
        : "Invalid authentication token"
    );
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.changedPasswordAfter?.(decoded.iat)) {
    throw new ApiError(401, "Password was changed; please log in again");
  }

  req.user = user;
  next();
});

export default protect;
