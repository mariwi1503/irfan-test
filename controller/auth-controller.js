require("dotenv").config();
const prisma = require("../db");
const validation = require("../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const utils = require("../utils");

module.exports = {
  register: async (req, res) => {
    try {
      const payload = await validation.registerSchema.validateAsync(req.body);
      let { email, name, password } = payload;
      email = email.toLowerCase(); // set email to lowercase

      // check email
      const emailExist = await prisma.user.findUnique({ where: { email } });
      if (emailExist) throw new Error("Email sudah digunakan");

      const hashedPassword = bcrypt.hashSync(password, 10);

      const randomString = utils.generateRandomString(4);
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          otp: randomString,
        },
      });

      await utils.sendEmail(
        email,
        "Email verification",
        `Hi ${name}, This is your otp code "${randomString}"`
      );

      /**
       * TODO:
       * register dengan google dan facebook
       */

      res.status(200).json({ status: "success", data: { id: newUser.id } });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const payload = await validation.loginSchema.validateAsync(req.body);
      let { email, password } = payload;
      email = email.toLowerCase(); // set email to lowercase
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User tidak ditemukan");

      // validate password
      const passwordCheck = bcrypt.compareSync(password, user.password);
      if (!passwordCheck) throw new Error("Password salah");

      // generate token
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { id: user.id, verified: user.emailVerified },
        jwtSecret,
        {
          expiresIn: 3600,
        }
      );
      const tokenExp = new Date();
      tokenExp.setHours(tokenExp.getHours() + 1);

      // save user logout time
      await prisma.user.update({
        where: { id: user.id },
        data: {
          logOut: null,
          loginTimes: user.loginTimes + 1,
          token,
          tokenExp,
        },
      });

      // create login log
      await prisma.userLogs.create({ data: { userId: user.id } });
      res.status(200).json({
        status: "success",
        data: { token },
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      const id = req.userId;
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) throw new Error("data user tidak ditemukan");

      // set logout time
      await prisma.user.update({
        where: { id },
        data: { logOut: new Date(), token: null, tokenExp: null },
      });
      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const payload = await validation.verifyEmail.validateAsync(req.body);
      let { email, otp } = payload;
      email = email.toLowerCase(); // set email to lowercase

      // check user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User tidak ditemukan");

      if (otp !== user.otp) throw new Error("Kode otp anda salah");

      // set email to verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
        },
      });

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const payload = await validation.loginSchema.validateAsync(req.body);
      const email = payload.email.toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Akun tidak ditemukan");
      }

      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const randomBytes = crypto.randomBytes(6);
      const passwordArr = Array.from(randomBytes).map(
        (byte) => characters[byte % characters.length]
      );

      const newPassword = passwordArr.join("");
      const password = bcrypt.hasher(newPassword);
      await prisma.user.update({ where: { id: user.id }, data: { password } });

      await sendEmail(
        email,
        "New Password",
        `Hi ${user.name}, this is your new password: \n ${newPassword}. \n Please change you password`
      );

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const password = payload.password;
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user) throw new Error("User tidak ditemukan");

      // update password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password,
        },
      });

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  resendOtp: async (req, res) => {
    try {
      const payload = await validation.getNewPassword.validateAsync(req.body);
      const email = payload.email.toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });
      console.log("🚀 ~ resendOtp: ~ user:", user);
      if (!user) throw new Error("User tidak ditemukan");

      const otp = utils.generateRandomString(4);
      console.log("🚀 ~ resendOtp: ~ otp:", otp);
      // update password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
        },
      });
      await utils.sendEmail(
        email,
        "New OTP",
        `Hi ${user.name}, This is your new otp code "${otp}"`
      );
      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};
