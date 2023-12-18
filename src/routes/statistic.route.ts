import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import { userAndTransactionRecord } from "../controller/statistics";

const router: any = Router();

router.get(
    "/overview",
    asyncWrapper(userAndTransactionRecord)
    );

export default router;

