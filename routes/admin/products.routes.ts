import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/products.controller";
import { uploadFields } from "../../middleware/admin/uploadCloud.middware";
import multer from "multer";
import { createValidate } from "../../validate/admin/products.validate";

const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.fields([{ name: "imagesFiles", maxCount: 10 }]),
  uploadFields,
  createValidate,
  controller.createPost
);
router.get("/detail/:id", controller.detail)
export const productsRoute = router;
