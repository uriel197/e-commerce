const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const puppeteer = require("puppeteer-core"); // Use puppeteer-core for non-default browsers
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 }); // Cache data for 1 hour 60s * 60mins

const getPuppeteerProducts = async (req, res) => {
  const idNumber = Math.random() * 10;
  try {
    const searchQuery = req.query.search || "laptops"; // Extract the search query from the request

    if (!searchQuery) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Search query is required" });
    }

    const cacheKey = `products-${searchQuery}`; // Cache key based on the search query
    const cachedProducts = cache.get(cacheKey);

    if (cachedProducts) {
      console.log("Returning cached data for query:", searchQuery);
      return res.status(200).json(cachedProducts);
    }

    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", // Adjust path as needed
    });
    const page = await browser.newPage();

    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
      searchQuery
    )}`;
    await page.goto(searchUrl);

    const products = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".s-main-slot .s-result-item")
      ).map((product) => {
        const title = product.querySelector("h2 span")?.innerText || "N/A";
        const image = product.querySelector(".s-image")?.src || null;
        const description =
          product.querySelector(".a-text-normal")?.innerText || "N/A";
        const priceWhole =
          product.querySelector(".a-price-whole")?.innerText || "";
        const priceFraction =
          product.querySelector(".a-price-fraction")?.innerText || "";
        const price =
          priceWhole && priceFraction ? `${priceWhole}${priceFraction}` : null;

        return { title, image, description, price };
      });
    });

    await browser.close();

    // Filter out products that don't have an image or price
    const filteredProducts = products.filter(
      (product) => product.image && product.price
    );

    // Cache the filtered products for the search query
    cache.set(cacheKey, filteredProducts);

    res.status(StatusCodes.OK).json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch products" });
  }
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, category, sort, shipping, price } =
    req.query; /* 1 */
  const queryObject = {};

  if (featured) {
    queryObject.featured = true;
  }
  if (company && company !== "all") {
    queryObject.company = company;
  }
  if (category && category !== "all") {
    queryObject.category = category;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (shipping) {
    queryObject.freeShipping = true;
  }
  if (price) {
    try {
      if (!isNaN(price)) {
        queryObject.price = { $lte: price };
      }
    } catch (error) {
      console.error("Error parsing price:", error);
    }
  }
  // Sort handling
  let result = Product.find(queryObject);

  if (sort === "low") {
    result = result.sort("price"); // Assuming you want to sort by name
  } else if (sort === "high") {
    result = result.sort("-price");
  }

  const products = await result;
  res.status(StatusCodes.OK).json({ products });
};

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate(
    "reviews"
  ); /* 1 */
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product with id number ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product with id number ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product with id number ${productId}`
    );
  }
  await product.remove(); /* 2 */
  res
    .status(StatusCodes.OK)
    .json({ msg: `product with id ${productId} has been removed` });
};

const uploadImage = async (req, res) => {
  //console.log("req.files:", req.files); /* 3 */
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  const productImage = req.files.image; /* 4 */

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  try {
    await productImage.mv(imagePath);
    // Since we're using express.static, we can return just the path relative to public
    //const relativePath = `/uploads/${productImage.name}`;
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${
      productImage.name
    }`;

    return res.status(StatusCodes.OK).json({ image: fullUrl });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Error uploading image", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getPuppeteerProducts,
};

/************************* COMMENTS ************************

***1: an extensive explanation is found in the Product.js model comment 1

***2: The "pre('remove')" hook allows you to perform actions before a document instance  is removed. this allows us to remove all reviews associated to the product we are about to remove before we remove it. which is something findOneAndRemove does not allow.
We must define a pre('remove') middleware in the Product schema to delete associated reviews when a product is removed:

ProductSchema.pre('remove', async function(next) {
    await this.model('Review').deleteMany({ product: this._id });
});

***3: In order to understand this better we need to go back to the client-side first. When you append the file to the FormData object on the client side, you use the append method to add a file with a specific key:

const formData = new FormData();
formData.append("image", productImage); // productImage is the file selected by the user.

This code adds the file to the FormData object with the key "image". When the FormData is sent to the server via fetch, it becomes part of the HTTP request.

Server-Side (req.files.image)
On the server side, the file is received as part of the request and is accessible through req.files which returns an object where image is a property:
{
  image: {
    name: 'hondo.jpg',
    data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 01 00 01 00 00 ff db 00 43 00 06 04 05 06 05 04 06 ... 27821 more bytes>,
    size: 27871,
    encoding: '7bit',
    tempFilePath: '',
    truncated: false,
    mimetype: 'image/jpeg',
    md5: 'e1fdf84d5126b6ca2e1c8ef9532be5a5',
    mv: [Function: mv]
  }
}


***4: req.files.image corresponds to the file that was uploaded under the key "image" in the FormData.
How They Relate:
formData.append("image", productImage): This code on the client-side adds the selected file to the FormData object under the key "image".
req.files.image: This on the server-side accesses the file that was sent under the key "image".
Essentially, the key "image" in formData.append("image", productImage) on the client side matches req.files.image on the server side, provided the middleware is set up to handle multipart/form-data requests and files.

*/
