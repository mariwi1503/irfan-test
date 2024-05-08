const Joi = require("@hapi/joi");

module.exports = {
  registerSchema: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .required(),
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  verifyEmail: Joi.object({
    otp: Joi.string().length(4).required(),
    email: Joi.string().email().required(),
  }),
  getNewPassword: Joi.object({
    email: Joi.string().email().required(),
  }),
  resetPassword: Joi.object({
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .required(),
  }),
};
