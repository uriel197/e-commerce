const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
  createUserToken,
} = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("That email is already in use");
  }

  // first registered user is admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const tokenUser = createUserToken(user); // name, userId and role
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please fill out all fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Email not found");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Password does not match");
  }
  const tokenUser = createUserToken(user); // { name: user.name, userId: user._id, role: user.role }
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  const token = req.signedCookies.token; /* 1 */
  //const { name } = isTokenValid({ token }); /* 2 */
  // Set the token cookie to expire immediately
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};

/********************** COMMENTS *********************

***1:  This line retrieves the token from the signed cookies in the request object. Signed cookies are used to ensure the integrity of the cookies, preventing tampering.

***2: the isTokenValid function attempts to verify the JWT token using jwt.verify. If the token is valid, it returns the decoded payload (which might contain properties such as name, userId etc); if the token is invalid, it throws an error.

res.cookie("token", "logout", {
  httpOnly: true,
  expires: new Date(Date.now() + 1000),
});
This line sets a cookie named token with the value "logout". The httpOnly: true option ensures that the cookie is not accessible via JavaScript, adding an extra layer of security.
The expires option sets the expiration date to 1 second from the current time (Date.now() + 1000 milliseconds), effectively expiring the cookie almost immediately. This effectively logs out the user by removing the token from the client's cookies.

res.status(StatusCodes.OK).json({ msg: `${name} logged out!` });
This line sends an HTTP response with status code 200 (OK) and a JSON object containing a message that includes the name extracted from the token, indicating that the user has successfully logged out.

*/
