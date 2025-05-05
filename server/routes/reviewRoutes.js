const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { authenticateUser } = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, getAllReviews)
  .post(authenticateUser, createReview);

router
  .route("/:id")
  .get(authenticateUser, getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
