const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error("--- ERROR STACK ---");
  console.error(err); // This will log the full error in the backend terminal
  console.error("--- END ERROR STACK ---");

  res.json({
    message: err.message,
    // In production, you would not send the stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
