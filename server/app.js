require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// database
const connect = require("./db/connect");

// packages
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewsRouter = require("./routes/reviewRoutes");
const ordersRouter = require("./routes/orderRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // to access cookies comming from the browser /* 1 */
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // origin: Specifies the client URL allowed to access your server. credentials: Allows cookies or authentication headers to be included in requests.

// to check whether the server is receiving the cookies
// app.use((req, res, next) => {
//   console.log("Cookies:", req.cookies);
//   console.log("Signed Cookies:", req.signedCookies);
//   next();
// });

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/api/v1", (req, res) => {
  res.send("e-commerce is live!!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/orders", ordersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();

/******************* COMMENTS *****************

***1: To use signed cookies in Express.js, you need to enable cookie signing by setting a secret key in your application configuration:

app.use(cookieParser("your-secret-key"));
This secret key should be kept secure and should not be shared publicly. When the client sends back the signed cookie, Express.js will automatically verify its integrity using the secret key.


*/
