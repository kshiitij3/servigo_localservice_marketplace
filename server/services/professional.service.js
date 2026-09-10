import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const updateAvailability = async (
  professionalId,
  availabilityStatus
) => {
  const professional = await User.findOneAndUpdate(
    {
      _id: professionalId,
      role: "professional",
      isActive: true,
    },
    {
      $set: {
        "professionalProfile.availabilityStatus":
          availabilityStatus,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!professional) {
    throw new ApiError(
      404,
      "Professional not found or inactive"
    );
  }

  return professional;
};

export const updateProfessionalLocation = async (
  professionalId,
  location
) => {
  const professional = await User.findOneAndUpdate(
    {
      _id: professionalId,
      role: "professional",
      isActive: true,
    },
    {
      $set: {
        location: {
          type: "Point",
          coordinates: [
            Number(location.coordinates[0]),
            Number(location.coordinates[1]),
          ],
          address: location.address || "",
          city: location.city || "",
          state: location.state || "",
          pincode: location.pincode || "",
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!professional) {
    throw new ApiError(
      404,
      "Professional not found or inactive"
    );
  }

  return professional;
};
