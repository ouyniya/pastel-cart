const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/create-error");

exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    // validate using Zod >> Middlewares / validation.js

    const isDuplicatedEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const isDuplicatedName = await prisma.user.findFirst({
      where: {
        name,
      },
    });

    if (isDuplicatedEmail) {
      return createError(409, "Duplicated Email");
    }

    if (isDuplicatedName) {
      return createError(400, "The name is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      name,
      password: hashedPassword,
    };

    await prisma.user.create({
      data,
    });

    res.json({ message: "Register successful" });
  } catch (error) {
    console.log("Register error: ", error.message);
    res.status(500).json({ errors: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate using Zod >> Middlewares / validation.js

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return createError(404, "User not found");
    }

    if (!user.enabled) {
      return createError(400, "User is banned");
    }

    // check password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return createError(400, "Invalid Password");
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    jwt.sign(
      userPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          return res.status(500).json({ errors: error.message });
        }
        res.json({ message: "Login successful", user: userPayload, token }); // do not send user data in this step
      }
    );
  } catch (error) {
    console.log("Login error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return createError(404, "User not found");
    }

    res.json({ user });
  } catch (error) {
    console.log("Get current user error: ", error);
    res.status(500).json({ errors: error.message });
  }
};
