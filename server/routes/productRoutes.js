const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getPuppeteerProducts,
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const { getSingleProductReviews } = require("../controllers/reviewController");

// Authentication and Routes
router
  .route("/")
  .post(authenticateUser, authorizePermission("admin"), createProduct)
  .get(getAllProducts);

router.route("/pup").get(getPuppeteerProducts);

router
  .route("/:id")
  .get(authenticateUser, getSingleProduct)
  .patch(authenticateUser, authorizePermission("admin"), updateProduct)
  .delete(authenticateUser, authorizePermission("admin"), deleteProduct);

router
  .route("/uploadImage") /*  */
  .post(authenticateUser, uploadImage);

router.route("/:id/reviews").get(getSingleProductReviews); /* 1 */

module.exports = router;

/************************* COMMENTS ************************

***1: a detailed explanation is found in reviewsControllers under "alternative"
*/
