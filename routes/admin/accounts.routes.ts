import express from "express";
import * as controller from "../../controllers/admin/acccounts.controller";
import * as accountsValidate from "../../validate/admin/accounts.validate"

const router = express.Router();


router.get("/", controller.index);
router.get("/my-account", controller.myAccount)
router.get("/create", controller.create)
router.post("/create", accountsValidate.create, controller.createPost)


export const accountsRoute = router;