import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/role.controller";

router.get("/", controller.index);




export const roleRoute = router;
