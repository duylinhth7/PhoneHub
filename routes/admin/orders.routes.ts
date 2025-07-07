import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/orders.controller";

router.get("/", controller.index);
router.patch("/changeStatus/:id", controller.changeStatus)
router.get("/detail/:id", controller.detail)
router.delete("/delete/:id", controller.deleteOrder)




export const ordersRoute = router;
