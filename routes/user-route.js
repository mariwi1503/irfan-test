const router = require("express").Router();
const middleware = require("../middleware");
const userController = require("../controller/user-controller");

router.get("/user/list", middleware.verifiedEmail, userController.userList);
router.get("/user/total", middleware.verifiedEmail, userController.totalUser);
router.get(
  "/user/active",
  middleware.verifiedEmail,
  userController.totalActiveUser
);
router.get(
  "/user/average",
  middleware.verifiedEmail,
  userController.averageActiveUser
);

module.exports = router;
