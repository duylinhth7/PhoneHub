import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/categories.controller";
import multer from "multer";
import { uploadFields, uploadSingle } from "../../middleware/admin/uploadCloud.middware";

const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("imageFile"),
  uploadSingle,
  controller.createPost
);
router.get("/detail/:id", controller.detail);
router.patch(
  "/edit/:id",
  upload.single("imageFile"),
  uploadSingle,
  controller.editPatch
);
router.delete("/delete/:id", controller.deleteCateggory)
export const categoriesRoute = router;