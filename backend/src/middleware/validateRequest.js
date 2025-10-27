const { validationResult } = require('express-validator');

/**
 * Middleware to validate request using express-validator
 * Returns 400 with validation errors if validation fails
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        statusCode: 400,
        details: errorMessages
      }
    });
  }

  next();
};

module.exports = validateRequest;
