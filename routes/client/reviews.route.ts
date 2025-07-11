import express from "express";
import * as controllers from "../../controllers/client/reviews.controller"

const router = express.Router();

router.post("/add", controllers.addReview);
router.delete("/delete/:id", controllers.deleteReview)

export const reviewsRoute = router;