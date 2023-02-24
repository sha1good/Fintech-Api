const router = require("express").Router();
const User = require("../models/user/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../util/error");

router.post("/register", async (request, response, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(request.body.password, salt);
    const newUser = new User({ ...request.body, password: hashPassword });
    const user = await newUser.save();
    response.status(200).json(user);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const user = await User.findOne({ username: request.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong username or password!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    const { password, isAdmin, ...otherDetails } = user._doc;
    response
      .cookie("accessToken",token, {
        httpOnly: true,
        maxAge: 86400000,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

module.exports = router;
