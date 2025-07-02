import express from "express";
import * as controller from "../../controllers/client/order.controller";

const router = express.Router();
router.post("/", controller.order);



export const orderRoute = router;