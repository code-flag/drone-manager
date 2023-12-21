import express, { Request, Response } from "express";
import cors from "cors";
import dotEnv from "dotenv";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import helmet from "helmet";
import morgan from "morgan";
import { NotFoundError } from "./helper/error";
import errorHandler from "./middleware/errorHandler";
import { serverOptions } from "./config/options";
import { DBConnection } from "./config/database";
import {
  s3,
  uploadBigKYCDocument,
  uploadKYCDocument,
  uploadProfilePic,
  disputeFileUpload
} from "./config/file-storage";
import { verifyAccessKey, verifyToken } from "./middleware/auth";
import { returnMsg } from "./helper/message-handler";
import { limiter } from "./middleware/apiRateLimit";
import router from "./routes/index.route";

dotEnv.config();
const app: any = express();
app.use(express.json({ limit: "50mb" }));

const server: any = createServer(app);
const io: any = new Server(server, {
  ...serverOptions,
});

/**  ================================== Database connection ==================================  */

DBConnection();

/**
 * Handles all user socket events
 */
const notification: any = io.of("/notification");
const deal: any = io.of("/deal");

/** ===================================== Middleware ===================================== */
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
app.set('trust proxy', '127.0.0.1');
// app.set('trust proxy', true);

// this is added to be able to use import.meta.value for email attachment

/** ============================= Helmet for securing api request headers =================== */
app.use(helmet());
if (
  ["development", "production"].includes(process.env.NODE_ENV || "development")
) {
  app.use(morgan("dev"));
}
// make folders visible
// app.use(express.static(path.join(__dirname,'public')));

/** ======================================= API ROUTES =======================================*/
app.use(limiter);
app.use(router);

app.get("/", (request: any, response: any) => {
  response.status(200).json({
    status: "success",
    message: "Welcome to Market place server API",
    data: {
      service: "Market place server",
      version: "2.0.0",
    },
  });
});

/** =============================== Upload Files or documents route =============================== */

app.post(
  "/profile-pic/upload",
  verifyAccessKey,
  verifyToken,
  uploadProfilePic.single("file"),
  async function (req: any, res: Response, next: any) {
   returnMsg(res, { url: req.file.location }, "Successfully uploaded");
  }
);

app.post(
  "/kyc/document-upload",
  verifyAccessKey,
  verifyToken,
  uploadKYCDocument.single("file"),
  async function (req: any, res: Response, next: any) {
   returnMsg(res, { url: req.file.location }, "Successfully uploaded");
  }
);

app.post(
  "/dispute/upload",
  verifyAccessKey,
  verifyToken,
  disputeFileUpload.single("file"),
  async function (req: any, res: Response, next: any) {
   returnMsg(res, { url: req.file.location }, "Successfully uploaded");
  }
);


app.post(
  "/kyc/big/document-upload",
  verifyAccessKey,
  verifyToken,
  uploadBigKYCDocument.single("file"),
  async function (req: any, res: Response, next: any) {
   returnMsg(res, { url: req.file.location }, "Successfully uploaded");
  }
);

app.get("/_storage_/list/:dir", async (req: any, res: any) => {
  try {
    const { dir } = req.params;
    let resp = await s3
      .listObjectsV2({ Bucket: `${process.env.AWS_S3_BUCKET}` })
      .promise();
    let mapData = resp.Contents.map((item: any) => item.Key);
   returnMsg(res,mapData, "files successfully retrieved");
  } catch (error: any) {
    console.log("error", error);
  }
});

app.get("/storage-file/download", async (req: any, res: any) => {
  try {
    let { filename} = req.query;
    const baseUrl = filename.substr(0, 53);
    const subStr = filename.substr(53);

  if (baseUrl === 'https://huiospay-store.s3.eu-central-1.amazonaws.com/') {
    filename = subStr;
  }
    let objData = await s3
      .getObject({ Bucket: `${process.env.AWS_S3_BUCKET}`, Key: filename })
      .promise();
    res.send(objData);
  } catch (error: any) {
    console.log("error", error);
  }
});

app.delete("/delete", async (req: any, res: any) => {
  let { filename } = req.query;

  const baseUrl = filename.substr(0, 53);
  const subStr = filename.substr(53);
  
  if (baseUrl === 'https://huiospay-store.s3.eu-central-1.amazonaws.com/') {
    filename = subStr;
  }
 const deletedData: any =  await s3
    .deleteObject({ Bucket: `${process.env.AWS_S3_BUCKET}`, Key: filename })
    .promise();
  returnMsg(res,deletedData, "File Deleted Successfully");
});

/** ================================== Invalid route response ================================ */

app.all("*", (request: any, response: any) => {
  throw new NotFoundError("Invalid route.");
});

/** ================================= General Errror Handling middleware ======================= */

app.use(errorHandler);

export default app;
