import express from "express";
import * as controller from "../../controllers/client/users.controller"
import * as usersValidate from "../../validate/client/users.validate";


const router = express.Router();


router.get("/register", controller.register);
router.post("/register", usersValidate.register, controller.registerPost);
router.get("/logout", controller.logout);
router.get("/login", controller.login);
router.post("/login", usersValidate.login, controller.loginPost);


export const usersRoute = router;