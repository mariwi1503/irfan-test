const router = require("express").Router();
const authController = require("../controller/auth-controller");
const middleware = require("../middleware");

router.post("/auth/register", authController.register);
router.post("/auth/verify", authController.verifyEmail);
router.post("/auth/login", authController.login);
router.post("/auth/resend-otp", authController.resendOtp);
router.get("/auth/new-password", authController.forgotPassword);
router.post("/auth/reset-password", middleware.user, authController.login);
router.put("/auth/logout", middleware.user, authController.logout);

module.exports = router;
