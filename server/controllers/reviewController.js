const Review = require("../models/Review");
const Product = require("../models/Product");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const getAllReviews = async (req, res) => {
  /* 1 */
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `Product with id number ${productId} was not found in the Database`
    );
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review with id number ${reviewId} was found!`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `Id number ${reviewId} was not found in the Database!`
    );
  }

  checkPermissions(req.user, review.user);

  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;

  await review.save(); /* 3 */
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `Id number ${reviewId} was not found in the Database!`
    );
  }
  checkPermissions(req.user, review.user);
  await review.remove(); /* 3 */
  res
    .status(StatusCodes.OK)
    .json({ msg: "Your review was succesfully deleted" });
};

/* 2 */
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId }); // find all reviews where the property "product" matches productId
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};

/********************* COMMENTS *********************

***1: here we are using the "populate" method, we are linking three properties from the Product schema, namely; name, company and price to our review response. a more extensive explanation is found in Review.js model.


**************** AN ALTERNATIVE TO VIRTUALS *******************

***2: getSingleProductReviews is another way of getting all the reviews associated with a single product, just like we did within the productController when we look for a single product and we linked our Review schema to the response.
Then we go to productRoutes and require the function and create a new route:

const { getSingleProductReviews } = require("../controllers/reviewController");
router.route('/:id/reviews).get(getSingleProductReviews);

***3: .remove() and .save() trigger the save and remove hooks which we define in the Review model.


*/
