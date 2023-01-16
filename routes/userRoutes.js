const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/email");
const crypto = require("crypto");
const Token = require("../models/tokenModel");
const clientURL = process.env.CLIENT_URL;
const User = require("../models/userModel");
const {
  validatePassword,
  validateEmail,
  validateName,
} = require("../utils/validators");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(403).json({
        err: "User already exist",
      });
    }

    if (!validateName(name)) {
      return res.status(400).json({
        err: "Invaid Name: name must be longer than two characters and most not include any number or special characters",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        err: "Invalid Email",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        err: "Invalid Password: password must be atleast 8 characters long and must include atleast one uppercase, one lowercase, one digit, one special character ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRound = 10));
    const user = { name, email, password: hashedPassword };
    const createdUser = new User(user);
    await createdUser.save();
    console.log(createdUser);
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0) {
      return res.status(400).json({
        err: "please provide email",
      });
    }
    if (password.length === 0) {
      return res.status(400).json({
        err: "please provide a password",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        err: "User not found",
      });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        err: "Invalid credentials",
      });
    }
    const payload = {
      user: { id: existingUser.id },
    };
    const bearerToken = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: 360000,
    });

    res.cookie("t", bearerToken, {
      expire: new Date() + 9999,
    });

    res.status(200).json({
      msg: "Signed in successfully",
      bearerToken,
    });
    console.log(bearerToken);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.get("/signout", (_req, res) => {
  try {
    res.clearCookie("t");
    return res.status(200).json({
      message: "Signed out successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/requestPasswordReset", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email does not exist" });

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(user.email, "Password Reset Request", link);
    res.status(200).json(link);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/passwordReset", async (req, res) => {
  try {
    const { userId, token, password } = req.body;
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      return res
        .status(404)
        .json({ msg: "Invalid or expired password reset token" });
    }
    console.log(passwordResetToken.token, token);

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    const user = await User.findById({ _id: userId });

    sendEmail(user.email, "password Reset", "Password Reset Successfully");

    await passwordResetToken.deleteOne();
    return res.status(201).json({ message: "Password reset was successful" });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
