const rateLimit = require("express-rate-limit");

exports.authLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200, // limit each IP to 10 requests per windowMs
  message: "Too many attempts, Please try again later.",
  standardHeaders: true, // adds `RateLimit-*` headers
  legacyHeaders: false, // disables the `X-RateLimit-*` headers

  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      errors: options.message,
    });
  },
});
