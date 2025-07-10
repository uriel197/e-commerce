const createUserToken = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    theme: user.theme,
  };
};

module.exports = createUserToken;
