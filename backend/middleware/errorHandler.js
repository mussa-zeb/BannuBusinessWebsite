export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed.",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};