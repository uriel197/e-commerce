const createUserToken = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
  };
};

module.exports = createUserToken;
