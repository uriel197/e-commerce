const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId /* 1 */,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); /* 2 */

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  /* 3 */
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);

/********************* COMMENTS ********************


 *******************  POPULATE Method ****************

***1: In MongoDB, the populate method is used in Mongoose (a MongoDB object modeling tool for Node.js) to replace the specified paths in a document with documents from other collections. This allows you to reference documents in different collections and automatically replace those references with the actual data from the referenced documents when you query the database.
Here's a breakdown of how populate works in the context of our code:

Schema Definitions:
We have three schemas: one for Review one for User and one for Product.

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must enter a name"],
    minlength: 3,
    maxlength: 50,
  },
  // other data
})

const productSchema = new mongoose.Schema({
  // other fields
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

const reviewSchema = new mongoose.Schema({
  // other fields
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'    
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);
const Product = mongoose.model('Product', productSchema);

In this setup, each review document has a user and product field which is an ObjectId that references a document in the User and Product collection.

Query with populate:
When you query the Review collection and use the populate method, Mongoose will automatically find the referenced Product and User documents and include their data in the result.
in the getSingleProduct function inside reviewsController.js we write:

const reviews = await Review.find({}).populate({
  path: 'product', product being the key inside the review Object and 
  select: 'name company price',
}).populate({
  path: 'user',  
  select: 'name',
});

path: 'product': This specifies the field in the Review schema that you want to populate. In this case, it's the product field. "product" is the name of the key in the review doc and "name company price" is the value of "product" which themselves are keys also.
select: 'name company price': This specifies which fields from the Product documents you want to include in the populated result. Here, only the name, company, and price fields of the Product are included.

resulting data:

{
  "_id": "reviewId",
  "user": "carl"
  "product": {
    "_id": "productId",
    "name": "Product Name",
    "company": "Product Company",
    "price": 100
  },
  // other review fields
}

***2: The compound index { product: 1, user: 1 } with the { unique: true } option in the Review schema ensures that each user can only write one review per product, preventing duplicate reviews and improving query performance. This is a useful constraint in scenarios where such uniqueness is required to maintain data integrity.

***3: Our static method is utilizing MongoDB's aggregation framework to calculate the average rating and the number of reviews for a product, and then updating the corresponding product document with these values. In order for this to work, we must first set up an aggregation pipeline under reviews in mongoDB.
we click on reviews, then we click on aggregation and then we add a stage:
we choose match and inside the first stage we write:
"product": ObjectId('664b19b4756fdb2dc276a691')
then, we add another stage and choose "group".
then we write inside the 2nd stage:
_id: null,
averageRating: {$avg: '$rating'},
numOfReviews: {$sum: 1}

and we r done with mongoDB.

code to communicate with MongoDB in our visual studio:

const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  The rest of the code is regular javascript to communicate with our server.
  
Note on result:

result is an array that contains an object:
[ { _id: null, averageRating: 1, numOfReviews: 3 } ]
that is why we must enter result[0] in:
averageRating: Math.ceil(result[0]?.averageRating || 0),
numOfReviews: result[0]?.numOfReviews || 0,

*/
