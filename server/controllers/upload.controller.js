import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadFile } from "../services/upload.service.js";

export const uploadMedia = asyncHandler(
  async (req, res) => {

    const uploadedFile = await uploadFile(
      req.file
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        "File uploaded successfully",
        uploadedFile
      )
    );
  }
);