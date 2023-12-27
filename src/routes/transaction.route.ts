import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";

import { addTransaction, filterTransactions, updateTransactionStatus } from "../controller/transaction.controller";

const router: any = Router();

router.post(
  "/create",
  asyncWrapper(addTransaction)
);

router.put(
  "/update/:transactionId",
  asyncWrapper(updateTransactionStatus)
);



router.get(
    "/all",
    asyncWrapper(filterTransactions)
  );

export default router;

