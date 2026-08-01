import mongoose from "mongoose";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";



export const registerUser = async (userData) => {
  const { name, email, phone, password, role } = userData;
  const session = await mongoose.startSession();
  let user;
  let token;

  try {
    await session.withTransaction(async () => {
      // Check if email or phone already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      }).session(session);

      if (existingUser) {
        if (existingUser.email === email) {
          throw new ApiError(409, "Email already registered");
        }

        if (existingUser.phone === phone) {
          throw new ApiError(409, "Phone number already registered");
        }
      }

      // Password hashing is handled by the User model
      const createdUsers = await User.create(
        [
          {
            name,
            email,
            phone,
            password,
            role,
          },
        ],
        { session }
      );

      user = createdUsers[0];
      token = generateToken(user._id);
    });

    return {
      user,
      token,
    };
  } finally {
    await session.endSession();
  }
};

export const loginUser = async (email, password) => {
  // Password is select:false in schema
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account has been disabled");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};


export const updateProfile = async (userId, updateData) => {
  const allowedFields = [
    "name",
    "phone",
    "profileImage",
    "location",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/**
 * Change Password
 */
export const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;

  // Password hashing + passwordChangedAt
  // are handled automatically by the model
  await user.save();

  return true;
};

/**
 * Logout
 *
 * JWT is stateless, so logout simply
 * clears the cookie in the controller.
 */
export const logoutUser = async () => {
  return true;
};
