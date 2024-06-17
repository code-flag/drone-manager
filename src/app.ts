import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { NotFoundError } from "./exceptions/error";
import errorHandler from "./middleware/errorHandler";
import { DBConnection } from "./config/database";
import { limiter } from "./middleware/apiRateLimit";
import router from "./routes/drone.route";
import { BatteryLevelsScheduler } from "./config/cronJob";

dotEnv.config();
const app: any = express();
app.use(express.json({ limit: "50mb" }));

/**  ================================== Database connection ==================================  */

DBConnection();

// header preflight configuration to prevent cors error
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
  })
);
// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** ============================= Helmet for securing api request headers =================== */
app.use(helmet());
if (
  ["development", "production"].includes(process.env.NODE_ENV || "development")
) {
  app.use(morgan("dev"));
}

/** ======================================= API ROUTES =======================================*/
app.use(limiter);
app.use(router);

app.get("/", (request: any, response: any) => {
  response.status(200).json({
    status: "success",
    message: "Welcome to Drone server API",
    data: {
      service: "Drone server",
      version: "2.0.0",
    },
  });
});

/** ================================== Invalid route response ================================ */

app.all("*", (request: any, response: any) => {
  throw new NotFoundError("Invalid route.");
});


/** ===================================== CRON JOB =========================================== */
BatteryLevelsScheduler.start();

/** ================================= General Errror Handling middleware ======================= */

app.use(errorHandler);

export default app;
