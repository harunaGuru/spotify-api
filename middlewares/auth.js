const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        err: " You must be logged in",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({
        err: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(503).json({
      err: "Token is not valid",
    });
  }
};

module.exports = isAuthenticated;
