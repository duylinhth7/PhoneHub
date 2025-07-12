import express from "express";
import * as controllers from "../../controllers/client/search.controller"

const router = express.Router();

router.get("/suggest", controllers.suggest)
router.get("/", controllers.searchAll)

export const searchRoute = router;