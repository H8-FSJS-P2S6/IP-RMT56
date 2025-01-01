const errorHandler = (err, req, res, next) => {
  let message = "Internal Server Error";
  let status = 500;

  // Authentication and Authorization Errors
  if (err.name === "AuthenticationRequired" || err.name === "Unauthorized") {
    status = 401;
    message = "Authentication required";
  } else if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  } else if (err.name === "Unauthenticated") {
    status = 401;
    message = "Invalid Email or Password";
  } else if (err.name === "Forbidden") {
    status = 403;
    message = "You don't have access";
  } else if (err.name === "GoogleFailed") {
    status = 401;
    message =
      "You already registered with our app, please login using your email and password";
  }

  // Validation Errors
  else if (
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "SequelizeValidationError"
  ) {
    status = 400;
    message = err.errors[0].message;
  } else if (err.name === "EmailRequired") {
    status = 400;
    message = "Email is required";
  } else if (err.name === "PasswordRequired") {
    status = 400;
    message = "Password is required";
  } else if (err.name === "EmailUsed") {
    status = 400;
    message = "Email already used";
  }

  res.status(status).json({
    message: message,
  });
};

module.exports = errorHandler;
