import express from "express";
import * as controller from "../../controllers/admin/acccounts.controller";
import * as accountsValidate from "../../validate/admin/accounts.validate"
import authorization from "../../middleware/admin/authorization.middleware";

const router = express.Router();


router.get("/", controller.index);
router.get("/my-account", controller.myAccount)
router.get("/create", authorization("admin"), controller.create)
router.post("/create",authorization("admin"), accountsValidate.create,  controller.createPost);
router.get("/detail/:id", authorization("admin"),  controller.detailAccount);
router.post("/edit/:id", authorization("admin"), accountsValidate.edit,  controller.editAccount);
router.delete("/delete/:id", authorization("admin"), controller.deleteAccount)


export const accountsRoute = router;