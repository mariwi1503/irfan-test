require("dotenv").config();
const prisma = require("../db");

module.exports = {
  totalUser: async (req, res) => {
    try {
      const totalUser = await prisma.user.count();
      res.status(200).json({
        status: "success",
        data: { total: totalUser },
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  numberOfTimesLogin: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          loginTimes: true,
        },
      });
      if (!user) throw new Error("User tidak ditemukan");
      res.status(200).json({
        status: "success",
        data: { total: user.loginTimes },
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
};
