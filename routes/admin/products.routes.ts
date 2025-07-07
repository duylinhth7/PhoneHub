import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/products.controller";
import { uploadFields } from "../../middleware/admin/uploadCloud.middware";
import multer from "multer";
import { productValidate } from "../../validate/admin/products.validate";

const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.fields([{ name: "imagesFiles", maxCount: 10 }]),
  uploadFields,
  productValidate,
  controller.createPost
);
router.get("/detail/:id", controller.detail);
router.post(
  "/edit/:id",
  upload.fields([{ name: "imagesFiles", maxCount: 10 }]),
  uploadFields,
  productValidate,
  controller.edit
);
router.delete("/delete/:id", controller.deleteProduct)
export const productsRoute = router;
