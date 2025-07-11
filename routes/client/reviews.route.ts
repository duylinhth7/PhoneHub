import express from "express";
import * as controllers from "../../controllers/client/reviews.controller"

const router = express.Router();

router.post("/add", controllers.addReview)

export const reviewsRoute = router;