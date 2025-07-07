import express from "express";
import * as controller from "../../controllers/client/categories.controller"


const router = express.Router();

router.get("/", controller.index)
router.get("/detail/:slug", controller.detail)


export const categoriesRoute = router;