import express from "express";
import * as controller from "../../controllers/client/products.controller"


const router = express.Router();

router.get("/:slug", controller.detail);


export const productsRoute = router;