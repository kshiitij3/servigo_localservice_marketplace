import jwt from "jsonwebtoken";

import User from "../models/User.js";

const getCookie = (cookieHeader, cookieName) => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");

    if (key === cookieName) {
      return decodeURIComponent(value.join("="));
    }
  }

  return null;
};

export const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
      getCookie(socket.handshake.headers?.cookie, "token");

    if (!token) {
      return next(
        new Error("Please login to continue")
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      return next(
        new Error(
          error.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid authentication token"
        )
      );
    }

    /*
     * Same user lookup as your protect middleware.
     */
    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return next(
        new Error("User not found")
      );
    }

    /*
     * Same password-change invalidation rule
     * as your REST authentication.
     */
    if (
      user.changedPasswordAfter?.(
        decoded.iat
      )
    ) {
      return next(
        new Error(
          "Password was changed; please log in again"
        )
      );
    }

    /*
     * Attach authenticated user to socket.
     *
     * From now on:
     * socket.user === authenticated User document
     */
    socket.user = user;

    next();
  } catch (error) {
    console.error(
      "Socket authentication error:",
      error
    );

    next(
      new Error(
        "Socket authentication failed"
      )
    );
  }
};