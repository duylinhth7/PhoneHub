import express from "express";
import * as controller from "../../controllers/client/users.controller"
import * as usersValidate from "../../validate/client/users.validate";


const router = express.Router();


router.get("/register", controller.register);
router.post("/register", usersValidate.register, controller.registerPost);
router.get("/logout", controller.logout);
router.get("/login", controller.login);
router.post("/login", usersValidate.login, controller.loginPost);
router.get("/password/forget", controller.forgetPassword);
router.post("/password/forget", usersValidate.forgetPassword, controller.forgetPasswordPost);
router.post("/password/otp", usersValidate.validateOtp, controller.otpPassword);
router.get("/password/reset", controller.resetPassword)
router.post("/password/reset", usersValidate.validateResetPassword, controller.resetPasswordPost);


export const usersRoute = router;