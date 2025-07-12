const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  throw error;
};

module.exports = createError;
