const Joi = require('joi');

const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  createTask: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.string().optional(),
  }),

  updateTask: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.string().optional(),
  }),

  updateProfile: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  schemas,
  validate,
};
