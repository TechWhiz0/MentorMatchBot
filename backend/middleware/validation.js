const { body, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  console.log("Validation request body:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// User login validation
const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Profile creation validation
const validateProfile = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("role")
    .isIn(["mentor", "mentee"])
    .withMessage("Role must be either mentor or mentee"),
  body("industries")
    .optional()
    .custom((value, { req }) => {
      // If role is mentor, industries should be an array
      if (req.body.role === "mentor") {
        if (!Array.isArray(value)) {
          throw new Error("Industries must be an array");
        }
        // Validate each industry item
        if (value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== "string" || value[i].trim().length === 0) {
              throw new Error(
                `Industry at index ${i} must be a non-empty string`
              );
            }
            // Trim whitespace from each industry
            value[i] = value[i].trim();
          }
          // Remove empty strings and duplicates
          const filteredIndustries = [
            ...new Set(value.filter((item) => item.length > 0)),
          ];
          req.body.industries = filteredIndustries;
        }
      } else {
        // For mentees, industries should be empty array
        if (Array.isArray(value) && value.length > 0) {
          throw new Error("Industries are only for mentors");
        }
        req.body.industries = [];
      }
      return true;
    })
    .withMessage("Industries must be a valid array of strings"),
  body("about")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("About section cannot exceed 1000 characters"),
  handleValidationErrors,
];

// Mentorship request validation
const validateMentorshipRequest = [
  body("mentor_id").isMongoId().withMessage("Invalid mentor ID"),
  body("proposal")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Proposal must be between 10 and 2000 characters"),
  body("preferred_time")
    .isISO8601()
    .withMessage("Preferred time must be a valid date"),
  handleValidationErrors,
];

// Session creation validation
const validateSession = [
  body("request_id").isMongoId().withMessage("Invalid request ID"),
  body("meeting_link").isURL().withMessage("Meeting link must be a valid URL"),
  body("scheduled_time")
    .isISO8601()
    .withMessage("Scheduled time must be a valid date"),
  handleValidationErrors,
];

// Project validation
const validateProject = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Project name must be between 1 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Project description must be between 1 and 1000 characters"),
  body("status")
    .optional()
    .isIn(["active", "completed", "archived"])
    .withMessage("Status must be active, completed, or archived"),
  handleValidationErrors,
];

// Todo validation
const validateTodo = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Todo text must be between 1 and 500 characters"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean value"),
  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfile,
  validateMentorshipRequest,
  validateSession,
  validateProject,
  validateTodo,
  handleValidationErrors,
};
