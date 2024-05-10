require("dotenv").config();
const prisma = require("../db");

module.exports = {
  userList: async (req, res) => {
    try {
      const userList = await prisma.user.findMany();

      // filter result
      let newResult = userList.map((x) => {
        return {
          id: x.id,
          email: x.email,
          name: x.name,
          createdAt: x.createdAt,
          loginTimes: x.loginTimes,
          logOut: x.logOut,
        };
      });
      res.status(200).json({
        status: "success",
        data: newResult,
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  totalUser: async (req, res) => {
    try {
      const totalUser = await prisma.user.count();
      res.status(200).json({
        status: "success",
        data: { totalUser },
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
  totalActiveUser: async (req, res) => {
    try {
      const totalActiveUser = await prisma.user.count({
        where: {
          token: { not: null },
          tokenExp: { gt: new Date() },
        },
      });
      res.status(200).json({
        status: "success",
        data: { totalActiveUser },
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },

  averageActiveUser: async (req, res) => {
    try {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);

      const userLoginSevenDaysRolling = await prisma.userLogs.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      });
      const averageUserActive = Number(
        (userLoginSevenDaysRolling / 7).toFixed(2)
      );
      res.status(200).json({
        status: "success",
        data: { averageUserActive },
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
};
