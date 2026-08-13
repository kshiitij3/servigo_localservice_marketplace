import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  updateAvailability,
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
