export const validateBody = (fields) => (req, res, next) => {
  const missing = [];

  fields.forEach((field) => {
    const value = req.body[field];

    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required field(s): ${missing.join(", ")}`,
    });
  }

  next();
};

export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export const validatePassword = (minLength = 6) => (req, res, next) => {
  const { password } = req.body;

  if (!password || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Password is required.",
    });
  }

  if (password.length < minLength) {
    return res.status(400).json({
      success: false,
      message: `Password must be at least ${minLength} characters.`,
    });
  }

  next();
};

export const validateRating = (req, res, next) => {
  const { rating } = req.body;

  const num = Number(rating);

  if (!Number.isFinite(num) || num < 1 || num > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number between 1 and 5.",
    });
  }

  req.body.rating = num;
  next();
};