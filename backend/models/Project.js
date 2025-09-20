const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Todo text is required"],
      trim: true,
      maxlength: [500, "Todo text cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const projectSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [1000, "Project description cannot exceed 1000 characters"],
    },
    todos: [todoSchema],
    status: {
      type: String,
      enum: {
        values: ["active", "completed", "archived"],
        message: "Status must be active, completed, or archived",
      },
      default: "active",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Indexes for better query performance
projectSchema.index({ user_id: 1 });
projectSchema.index({ user_id: 1, status: 1 });
projectSchema.index({ created_at: -1 });

// Virtual for progress calculation
projectSchema.virtual("progress").get(function () {
  if (this.todos.length === 0) return 0;
  const completedTodos = this.todos.filter((todo) => todo.completed).length;
  return Math.round((completedTodos / this.todos.length) * 100);
});

// Ensure virtual fields are serialized
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Project", projectSchema);
