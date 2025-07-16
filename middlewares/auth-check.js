const prisma = require("../configs/prisma");
const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");

exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return createError(401, "Unauthorized, no token sent");
    }

    const token = headerToken.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });

    if (!user.enabled) {
      return createError(400, "This user is banned");
    }

    next();
  } catch (error) {
    console.log(error);
    if (error.message === 'invalid signature') {
      res.status(401).json({errors: "session expired"})
    }
    res.status(500).json({ errors: error.message })
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { email, role } = req.user;
    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      return createError(404, "User not found");
    }

    if (role !== "ADMIN") {
      return createError(403, "Access Denied: Admin only");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message })
  }
};
