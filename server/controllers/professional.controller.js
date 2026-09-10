import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  updateAvailability,
  updateProfessionalLocation,
} from "../services/professional.service.js";

export const updateProfessionalAvailability =
  asyncHandler(async (req, res) => {
    const professional = await updateAvailability(
      req.user._id,
      req.body.availabilityStatus
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Availability updated successfully",
        {
          availabilityStatus:
            professional.professionalProfile
              ?.availabilityStatus,
        }
      )
    );
  });

export const updateProfessionalLocationController =
  asyncHandler(async (req, res) => {
    const professional = await updateProfessionalLocation(
      req.user._id,
      req.body.location
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Professional location updated successfully",
        {
          location: professional.location,
        }
      )
    );
  });
