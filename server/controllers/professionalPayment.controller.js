import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import razorpay from "../config/razorpay.js";
import User from "../models/User.js";


/*
==========================================
Professional Payment Onboarding
==========================================

Creates a Razorpay Linked Account for the
professional so they can receive route
transfers from customer payments.
*/

export const onboardPayment = asyncHandler(
  async (req, res) => {

    const professionalId = req.user._id;

    const {
      legalBusinessName,
      customerFacingBusinessName,
      businessType,
    } = req.body;


    // ----------------------------------------
    // 1. Find Professional
    // ----------------------------------------

    const professional = await User.findOne({
      _id: professionalId,
      role: "professional",
      isActive: true,
    });

    if (!professional) {
      throw new ApiError(
        404,
        "Professional not found or inactive"
      );
    }


    // ----------------------------------------
    // 2. Check if already onboarded
    // ----------------------------------------

    const paymentProfile =
      professional.professionalProfile?.paymentProfile;

    if (
      paymentProfile?.razorpayAccountId &&
      paymentProfile?.onboardingStatus === "active"
    ) {
      throw new ApiError(
        400,
        "Professional is already onboarded for payments"
      );
    }


    // ----------------------------------------
    // 3. Create Razorpay Linked Account
    // ----------------------------------------

    let linkedAccount;

    try {

      linkedAccount =
        await razorpay.accounts.create({
          email: professional.email,
          profile: {
            category: "individual",
            subcategory: "services",
            addresses: {
              registered: {
                street1: "NA",
                city: "NA",
                state: "MH",
                postal_code: "400001",
                country: "IN",
              },
            },
          },
          legal_business_name: legalBusinessName,
          business_type: businessType || "individual",
          legal_info: {
            pan: "",
            gst: "",
          },
        });

    } catch (error) {

      console.error(
        "Razorpay linked account creation failed:",
        error
      );

      throw new ApiError(
        502,
        "Payment provider failed to create linked account"
      );
    }


    // ----------------------------------------
    // 4. Save Razorpay Account to Profile
    // ----------------------------------------

    await User.findByIdAndUpdate(
      professionalId,
      {
        $set: {
          "professionalProfile.paymentProfile.razorpayAccountId":
            linkedAccount.id,

          "professionalProfile.paymentProfile.onboardingStatus":
            "pending",

          "professionalProfile.paymentProfile.isPaymentEnabled":
            false,
        },
      },
      { new: true, runValidators: true }
    );


    // ----------------------------------------
    // 5. Return Response
    // ----------------------------------------

    return res.status(201).json(
      new ApiResponse(
        201,
        "Professional payment onboarding initiated successfully",
        {
          razorpayAccountId: linkedAccount.id,
          onboardingStatus: "pending",
          legalBusinessName,
          customerFacingBusinessName,
        }
      )
    );
  }
);
