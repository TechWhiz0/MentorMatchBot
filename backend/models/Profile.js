const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["mentor", "mentee"],
        message: "Role must be either mentor or mentee",
      },
    },
    industries: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      trim: true,
      maxlength: [1000, "About section cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Index for better query performance
profileSchema.index({ role: 1 });
profileSchema.index({ user_id: 1 });

module.exports = mongoose.model("Profile", profileSchema);
