import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword,
} from "../services/auth.service.js";

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};


export const register = asyncHandler(async (req, res) => {
  let user;
  let token;

  try {
    ({ user, token } = await registerUser(req.body));

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json(
        new ApiResponse(
          201,
          "User registered successfully",
          {
            user,
            token,
          }
        )
      );
  } catch (error) {
    if (user?._id) {
      await User.findByIdAndDelete(user._id).catch(() => {});
    }

    throw error;
  }
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginUser(email, password);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        "Login successful",
        {
          user,
          token,
        }
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser();

  return res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Logout successful"
      )
    );
});


export const getMe = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile fetched successfully",
      user
    )
  );
});


export const updateMe = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile updated successfully",
      user
    )
  );
});


export const updateMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password updated successfully"
    )
  );
});
