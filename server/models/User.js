import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
  

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

   

    role: {
      type: String,
      enum: {
        values: ["customer", "professional"],
        message: "Role must be customer or professional",
      },
      required: [true, "User role is required"],
    },

    

    profileImage: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      // IMPORTANT:
      // GeoJSON format is [longitude, latitude]
      coordinates: {
        type: [Number],
        default: [0, 0],
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      pincode: {
        type: String,
        default: "",
        trim: true,
      },
    },

    

    isOnline: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    

    professionalProfile: {
      bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
        default: "",
      },

      skills: [
        {
          type: String,
          trim: true,
        },
      ],

      // We can later change this to
      // ObjectId references to Category
      categories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],

      experience: {
        type: Number,
        default: 0,
        min: [0, "Experience cannot be negative"],
      },

      // Maximum distance in kilometers
      // professional is willing to travel
      serviceRadius: {
        type: Number,
        default: 10,
        min: [1, "Service radius must be at least 1 km"],
        max: [100, "Service radius cannot exceed 100 km"],
      },

      portfolio: [
        {
          url: {
            type: String,
            required: true,
          },

          publicId: {
            type: String,
            default: "",
          },

          caption: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],

      completedJobs: {
        type: Number,
        default: 0,
        min: 0,
      },

      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      totalReviews: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    
    lastLogin: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },

  {
    timestamps: true,
  }
);


userSchema.index({
  location: "2dsphere",
});

// Helpful when searching professionals
userSchema.index({
  role: 1,
  isOnline: 1,
});

userSchema.pre("save", async function () {
  // Do not hash password again
  // when updating other fields
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return jwtTimestamp < changedTimestamp;
  }

  return false;
};


userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;