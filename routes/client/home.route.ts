import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/home.controller";


router.get("/", controller.home)

export const homeRoute = router;