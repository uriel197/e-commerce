const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createUserToken,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  if (!users) {
    throw new CustomError.NotFoundError("No active users");
  }
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  /* 1 */
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  /* updated */
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email; // updating the old values
  user.name = name;

  await user.save(); /* 2 */

  const tokenUser = createUserToken(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please fill in both fields");
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("password does not match");
  }
  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "password was successfuly updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  showCurrentUser,
  updateUserPassword,
};

/******************* COMMENTS *****************

***1: In your code, the authenticateUser middleware function attaches the user information to the req object before passing it along to the next middleware or route handler. Specifically, it attaches the user information to req.user.
Here's the relevant part of your authenticateUser function:

req.user = { name, userId, role };
By assigning { name, userId, role } to req.user, you're essentially storing the authenticated user information in the req object. This allows downstream middleware or route handlers to access this information.
In your showCurrentUser route handler, you're accessing req.user:

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
Since req.user has been populated by the authenticateUser middleware, showCurrentUser can access the user information and send it back as a JSON response without explicitly defining user inside showCurrentUser.

*** updated: the previous code with findOneAndUpdate instead of user.save() was:

  const updateUser = async (req, res) => {
       const { email, name } = req.body;
    if (!email || !name) {
         throw new CustomError.BadRequestError('Please provide all values');

    }
    const user = await User.findOneAndUpdate(
         { _id: req.user.userId },
         { email, name },
         { new: true, runValidators: true }

    );
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
 };

***2: await user.save() is used to save the newly created user to the database. This assumes that User is a Mongoose model or another type of database model, and user is an instance of that model representing the new user.

After creating the user with User.create(), calling await user.save() persists the user data to the database

*/
