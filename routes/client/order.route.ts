import express from "express";
import * as controller from "../../controllers/client/order.controller";

const router = express.Router();
router.get("/", controller.index)
router.post("/", controller.order);
router.get("/detail/:id", controller.detail)
router.get("/success", controller.success)
router.post("/cancel/:id", controller.cancel)



export const orderRoute = router;