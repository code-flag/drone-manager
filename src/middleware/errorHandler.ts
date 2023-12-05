import { config } from "dotenv";
import debug from "debug";

config();

const DEBUG = debug("dev");

export default (error: any, _: any, response: any, next: any) => {
  const isProduction = process.env.NODE_ENV === "production";
  let errorMessage = {};

  if (response.headersSent) {
    return next(error);
  }

  if (!isProduction) {
    DEBUG(error.stack);
    errorMessage = error;
  }

  return response.status(error.statusCode || 500).json({
    status: "error",
    error: {
      message: error.message,
      ...(error.errors && { errors: error.errors }),
      ...(!isProduction && { trace: errorMessage }),
    },
  });
};
