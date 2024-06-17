
const rateLimit = require("express-rate-limit");

// Define your rate limit options
export const limiter = rateLimit({
  windowMs: 0.4 * 60 * 1000, // 15 secs
  max: 10, // Max requests per IP within the windowMs
  handler: (req: any, res: any) => {
    res.status(429).json({
      message: {
        error: "Too many requests, please try again later.",
      },
    });
  },
});
