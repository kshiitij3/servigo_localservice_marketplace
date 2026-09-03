import api from "./api";

export const updateAvailability = async (
  availabilityStatus
) => {
  return await api.patch(
    "/professionals/availability",
    {
      availabilityStatus,
    }
  );
};
