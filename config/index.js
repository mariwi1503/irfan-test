require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mailConfig: {
    email: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  jwtSecret: process.env.JWT_SECRET,
};
