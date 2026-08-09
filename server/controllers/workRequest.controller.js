import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createWorkRequest,
  getMyWorkRequests,
  getWorkRequestById,
  updateWorkRequest,
  deleteWorkRequest,
  getNearbyWorkRequests,
} from "../services/workRequest.service.js";



export const create = asyncHandler(async (req, res) => {
  const workRequest = await createWorkRequest(
    req.user._id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Work request created successfully.",
      workRequest
    )
  );
});



export const getMine = asyncHandler(async (req, res) => {
  const requests = await getMyWorkRequests(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Work requests fetched successfully.",
      requests
    )
  );
});



export const getById = asyncHandler(async (req, res) => {
  const workRequest = await getWorkRequestById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Work request fetched successfully.",
      workRequest
    )
  );
});



export const update = asyncHandler(async (req, res) => {
  const workRequest = await updateWorkRequest(
    req.params.id,
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Work request updated successfully.",
      workRequest
    )
  );
});



export const remove = asyncHandler(async (req, res) => {
  await deleteWorkRequest(
    req.params.id,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Work request deleted successfully."
    )
  );
});



export const getNearby = asyncHandler(async (req, res) => {
  const { longitude, latitude, categories } = req.query;

  const categoryIds = categories
    ? categories.split(",")
    : [];

  const workRequests =
    await getNearbyWorkRequests(
      Number(longitude),
      Number(latitude),
      categoryIds
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Nearby work requests fetched successfully.",
      workRequests
    )
  );
});