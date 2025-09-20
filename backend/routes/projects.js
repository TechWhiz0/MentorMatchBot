const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Profile = require("../models/Profile");
const { protect } = require("../middleware/auth");
const { validateProject, validateTodo } = require("../middleware/validation");

// Get all projects for the authenticated user (mentee only)
router.get("/", protect, async (req, res) => {
  try {
    // Check if user is a mentee
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile || profile.role !== "mentee") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only mentees can access projects.",
      });
    }

    const projects = await Project.find({ user_id: req.user.id }).sort({
      created_at: -1,
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create a new project
router.post("/", protect, ...validateProject, async (req, res) => {
  try {
    // Check if user is a mentee
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile || profile.role !== "mentee") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only mentees can create projects.",
      });
    }

    const { name, description } = req.body;

    const project = new Project({
      user_id: req.user.id,
      name,
      description,
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update a project
router.put("/:id", protect, ...validateProject, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      user_id: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete a project
router.delete("/:id", protect, async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOneAndDelete({
      _id: projectId,
      user_id: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Add a todo to a project
router.post("/:id/todos", protect, ...validateTodo, async (req, res) => {
  try {
    const { text } = req.body;
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      user_id: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.todos.push({ text });
    await project.save();

    res.status(201).json({
      success: true,
      message: "Todo added successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update a todo
router.put(
  "/:projectId/todos/:todoId",
  protect,
  ...validateTodo,
  async (req, res) => {
    try {
      const { text, completed } = req.body;
      const { projectId, todoId } = req.params;

      const project = await Project.findOne({
        _id: projectId,
        user_id: req.user.id,
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const todo = project.todos.id(todoId);
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      // Update todo fields
      if (text !== undefined) todo.text = text;
      if (completed !== undefined) todo.completed = completed;

      await project.save();

      res.json({
        success: true,
        message: "Todo updated successfully",
        data: project,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Delete a todo
router.delete("/:projectId/todos/:todoId", protect, async (req, res) => {
  try {
    const { projectId, todoId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      user_id: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const todo = project.todos.id(todoId);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todo.deleteOne();
    await project.save();

    res.json({
      success: true,
      message: "Todo deleted successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get project statistics
router.get("/stats", protect, async (req, res) => {
  try {
    // Check if user is a mentee
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile || profile.role !== "mentee") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only mentees can access project statistics.",
      });
    }

    const projects = await Project.find({ user_id: req.user.id });

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "active").length,
      completedProjects: projects.filter((p) => p.status === "completed")
        .length,
      totalTodos: projects.reduce((sum, p) => sum + p.todos.length, 0),
      completedTodos: projects.reduce(
        (sum, p) => sum + p.todos.filter((t) => t.completed).length,
        0
      ),
      averageProgress:
        projects.length > 0
          ? Math.round(
              projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
            )
          : 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching project stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
