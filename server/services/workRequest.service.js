import WorkRequest from "../models/WorkRequest.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";



const validateCategory = async (categoryId, customCategory) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (
    category.slug === "other" &&
    (!customCategory || customCategory.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Please specify the custom category."
    );
  }

  return category;
};

const validateBudget = (budget) => {
  if (!budget) return;

  const { min, max } = budget;

  if (
    min !== undefined &&
    max !== undefined &&
    min > max
  ) {
    throw new ApiError(
      400,
      "Minimum budget cannot exceed maximum budget."
    );
  }
};

const generateQuoteDeadline = () => {
  const deadline = new Date();

  deadline.setHours(deadline.getHours() + 24);

  return deadline;
};



export const createWorkRequest = async (
  customerId,
  workRequestData
) => {

  const {
    title,
    description,
    category,
    customCategory,
    media,
    location,
    budget,
    preferredDate,
    preferredTimeSlot,
    isUrgent,
    visibilityRadius,
  } = workRequestData;

  // Validate category
  await validateCategory(
    category,
    customCategory
  );

  // Validate budget
  validateBudget(budget);

  // Generate quote deadline
  const quoteDeadline = generateQuoteDeadline();

  // Create request
  const workRequest = await WorkRequest.create({

    customer: customerId,

    title,

    description,

    category,

    customCategory,

    media,

    location,

    budget,

    preferredDate,

    preferredTimeSlot,

    isUrgent,

    visibilityRadius,

    quoteDeadline,

  });

  return workRequest;
};


export const getMyWorkRequests = async (
  customerId
) => {

  return await WorkRequest.find({

    customer: customerId,

    isDeleted: false,

  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

};



export const getWorkRequestById = async (
  workRequestId
) => {

  const workRequest =
    await WorkRequest.findOne({

      _id: workRequestId,

      isDeleted: false,

    })
      .populate(
        "customer",
        "name profileImage"
      )
      .populate(
        "category",
        "name slug"
      )
      .populate(
        "selectedProfessional",
        "name profileImage professionalProfile.averageRating"
      );

  if (!workRequest) {

    throw new ApiError(
      404,
      "Work request not found"
    );

  }

  return workRequest;
};



export const updateWorkRequest = async (
  workRequestId,
  customerId,
  updateData
) => {

  const workRequest =
    await WorkRequest.findOne({

      _id: workRequestId,

      customer: customerId,

      isDeleted: false,

    });

  if (!workRequest) {

    throw new ApiError(
      404,
      "Work request not found"
    );

  }

  if (workRequest.status !== "OPEN") {

    throw new ApiError(
      400,
      "Only open work requests can be updated."
    );

  }

  if (updateData.category || updateData.customCategory !== undefined) {

    await validateCategory(
      updateData.category || workRequest.category,
      updateData.customCategory ?? workRequest.customCategory
    );

  }

  if (updateData.budget !== undefined) {
    const nextBudget = {
      ...(workRequest.budget?.toObject?.() || workRequest.budget || {}),
      ...updateData.budget,
    };

    validateBudget(nextBudget);
    updateData = { ...updateData, budget: nextBudget };
  }

  const allowedFields = [
    "title",
    "description",
    "category",
    "customCategory",
    "isUrgent",
    "visibilityRadius",
    "budget",
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      workRequest[field] = updateData[field];
    }
  }

  await workRequest.save();

  return workRequest;
};


export const deleteWorkRequest = async (
  workRequestId,
  customerId
) => {

  const workRequest =
    await WorkRequest.findOne({

      _id: workRequestId,

      customer: customerId,

      isDeleted: false,

    });

  if (!workRequest) {

    throw new ApiError(
      404,
      "Work request not found"
    );

  }

  if (
    workRequest.status === "IN_PROGRESS" ||
    workRequest.status === "COMPLETED"
  ) {

    throw new ApiError(
      400,
      "This work request cannot be deleted."
    );

  }

  workRequest.isDeleted = true;

  await workRequest.save();

  return true;
};



export const getNearbyWorkRequests = async (
  longitude,
  latitude,
  categoryIds = []
) => {

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude) ||
    longitude < -180 || longitude > 180 ||
    latitude < -90 || latitude > 90
  ) {
    throw new ApiError(400, "Valid longitude and latitude are required");
  }

  const query = {

    status: "OPEN",

    isDeleted: false,

    location: {

      $near: {

        $geometry: {

          type: "Point",

          coordinates: [
            longitude,
            latitude,
          ],

        },

        // 10 km
        $maxDistance: 10000,

      },

    },

  };

  if (categoryIds.length) {

    query.category = {
      $in: categoryIds,
    };

  }

  return await WorkRequest.find(query)
    .populate("category", "name slug")
    .populate("customer", "name")
    .sort({ createdAt: -1 });

};
