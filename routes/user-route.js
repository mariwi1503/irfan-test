const router = require("express").Router();
const middleware = require("../middleware");
const userController = require("../controller/user-controller");

router.get("/user/total", middleware.verifiedEmail, userController.totalUser);
router.get(
  "/user/total-login/:userId",
  middleware.verifiedEmail,
  userController.numberOfTimesLogin
);

module.exports = router;
