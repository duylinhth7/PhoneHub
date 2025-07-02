import express from "express";
import * as controller from "../../controllers/client/cart.controller"


const router = express.Router();

router.get("/", controller.index)
router.post("/list", controller.listCart);


export const cartRoute = router;