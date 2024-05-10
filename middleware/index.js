const jwt = require("jsonwebtoken");
const prisma = require("../db");
const config = require("../config");
const jwtSecret = config.jwtSecret;

module.exports = {
  user: async (req, res, next) => {
    try {
      // const token = req.headers.authorization.split(" ")[1];
      const token = req.headers.authorization;
      if (!token) throw new Error("Unauthorized");

      const verify = jwt.verify(token, jwtSecret);
      if (!verify) throw new Error("Unauthorized");

      const user = await prisma.user.findUnique({ where: { id: verify.id } });
      if (!user) throw new Error("User not found");

      if (!user.token || user.token != token)
        throw new Error("Session invalid");

      req.user = user;
      req.userId = user.id;
      next();
    } catch (error) {
      res.status(401).json({ status: "failed", message: error.message });
    }
  },
  verifiedEmail: async (req, res, next) => {
    try {
      // const token = req.headers.authorization.split(" ")[1];
      const token = req.headers.authorization;
      if (!token) throw new Error("Unauthorized");

      const verify = jwt.verify(token, jwtSecret);
      if (!verify) throw new Error("Unauthorized");
      if (!verify.verified) throw new Error("Verified user only");

      const user = await prisma.user.findUnique({ where: { id: verify.id } });
      if (!user) throw new Error("User not found");
      if (!user.token || user.token != token)
        throw new Error("Session invalid");

      req.user = user;
      req.userId = user.id;
      next();
    } catch (error) {
      res.status(401).json({ status: "failed", message: error.message });
    }
  },
};
