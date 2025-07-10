import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/orders.controller";
import authorization from "../../middleware/admin/authorization.middleware";

router.get("/", controller.index);
router.patch("/changeStatus/:id", authorization("order-staff"), controller.changeStatus)
router.get("/detail/:id", controller.detail)
router.delete("/delete/:id",authorization("order-staff"), controller.deleteOrder)




export const ordersRoute = router;
