import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";

import { addCart, deleteCart, getUserCartPaginated, getOneCart } from "controller/cart.controller";

const router: any = Router();

router.post(
  "/create",
  asyncWrapper(addCart)
);

router.get(
  "/user/:cartId",
  asyncWrapper(getOneCart)
);

router.get(
  "/all",
  asyncWrapper(getUserCartPaginated)
);

router.delete("/delete/:cartId", asyncWrapper(deleteCart));

export default router;
