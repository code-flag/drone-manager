import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import { addOrder, deleteOrder, getManyOrder, getOneOrder, updateOrder } from "../controller/order.controller";

const router: any = Router();

router.post(
  "/create",
  verifyAccessKey,
  verifyToken,
  asyncWrapper(addOrder)
);

router.put(
  "/update/:orderId",
  verifyAccessKey,
  verifyToken,
  asyncWrapper(updateOrder)
);



router.get(
    "/all",
    verifyAccessKey,
    verifyToken,
    asyncWrapper(getManyOrder)
  );

  router.get(
    "/:orderId",
    verifyAccessKey,
    verifyToken,
    asyncWrapper(getOneOrder)
  );
  
router.delete("/delete/:orderId",
verifyAccessKey,
verifyToken,
 asyncWrapper(deleteOrder)
 );

export default router;

