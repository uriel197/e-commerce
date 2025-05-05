const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "product name must be provided"],
    },
    price: {
      type: Number,
      required: [true, "product price must be provided"],
      default: 0,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "please add a category"],
      enum: ["all", "travel", "furniture", "bedroom", "clothing", "shoes"],
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      enum: {
        values: ["all", "ikea", "canada-goose", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: "#222",
      colors: ["#222", "#333"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
/* 1 */
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: {rating: 5},   this can be used to filter the reviews by rating
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
}); /* 3 */

module.exports = mongoose.model("Product", ProductSchema);

/*********************** COMMENTS *********************


************************ VIRTUALS *************************

***1: The virtual method in Mongoose is used to create virtual properties on your schema that are not stored in the database but can be used for various purposes, such as creating relationships between different collections. In our case, we are defining a virtual property called reviews on the Product schema to establish a relationship between Product and Review documents.

Here's a breakdown of how this virtual property works:

Schema Definition:
We define a virtual property called reviews on the Product schema. This virtual property is used to dynamically reference the related Review documents that are associated with a particular Product.

const productSchema = new mongoose.Schema({
  name: String,
  company: String,
  price: Number,
  // other fields
});

then, we add the following line after defining the schema:

{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }

These options ensure that virtual properties (like the reviews virtual property in the Product schema) are included when documents are converted to JSON (toJSON) or plain JavaScript objects (toObject).
Usage in Review Schema: If the Review schema does not have any virtual properties that you need to include in JSON or plain object representations, there is no need to add these options.

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: {rating: 5}, // this can be used to filter the reviews by rating
});

Options in Virtual Property:

ref: "Review": This tells Mongoose that the reviews virtual property refers to the Review model.
localField: "_id": This specifies that the local field _id (from the Product schema) should be used to match documents in the Review collection.
foreignField: "product": This specifies that the product field in the Review schema is the foreign key that refers to the Product documents.
justOne: false: This indicates that the virtual property should contain an array of Review documents, not just one. If you set this to true, it would return a single review (if any) instead of an array.
match: { rating: 5 } (commented out in your example): This optional field can be used to filter the referenced documents. In this case, it would limit the reviews to only those with a rating of 5.

Using the Virtual Property:
When you populate this virtual property in a query, Mongoose will look up all Review documents where the product field matches the _id of the Product document and include them in the reviews virtual field.
then, inside productController you link your new virtuals to the model's method you are linking them to, which in this case is getSingleProduct, because we want our products to include reviews about them.

const products = await Product.find({}).populate('reviews');

The resulting products array will contain Product documents, each with a reviews field that includes an array of related Review documents.

Example Output:
When you query the Product collection with the virtual reviews field populated, each product document might look like this:

{
  "_id": "productId",
  "name": "Product Name",
  "company": "Product Company",
  "price": 100,
  "reviews": [
    {
      "_id": "reviewId1",
      "content": "Great product!",
      "rating": 5,
      "product": "productId"
    },
    {
      "_id": "reviewId2",
      "content": "Good value.",
      "rating": 4,
      "product": "productId"
    }
  ]
}


***2: The reason you cannot directly add a reviews field to the productSchema in the same way you added the user field is due to the nature of the relationship between products and reviews. Here's a detailed explanation:

One-to-Many Relationship:

User to Product: This is typically a one-to-many relationship, where one user can own multiple products. You can represent this relationship with a single field in the Product schema that references the User model.
Product to Reviews: This is also a one-to-many relationship, but in the opposite direction. One product can have many reviews. If you add a reviews field to the Product schema as an ObjectId, it would imply that a product can only have a single review, which is not what you want.
Storing Multiple References:
For the relationship between products and reviews, you need to store multiple review references for a single product. This requires a different approach. Instead of storing a single ObjectId reference in the Product schema, you should define the relationship in the Review schema and use Mongoose's populate method or virtual properties to manage this relationship.
First, we link reviews to products, using a virtual property in the Product schema:

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

Then we need to fetch a product with its associated reviews, you can use the populate method inside productControllers:

const product = await Product.findById(productId).populate('reviews');

***3: ***2: The "pre('remove')" hook allows you to perform actions before a document instance  is removed. this allows us to remove all reviews associated to the product we are about to remove before we remove it. which is something findOneAndRemove does not allow.
We must define a pre('remove') middleware in the Product schema to delete associated reviews when a product is removed:

ProductSchema.pre('remove', async function(next) {
    await this.model('Review').deleteMany({ product: this._id });
});


*/
