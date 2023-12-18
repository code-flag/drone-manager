import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import {
  addProduct,
  deleteProduct,
  getManyProduct,
  getOneProduct,
  updateProduct,
} from "../controller/product.controller";

const router: any = Router();

router.post("/create", verifyAccessKey, verifyToken, asyncWrapper(addProduct));

router.put(
  "/update/:productId",
  verifyAccessKey,
  verifyToken,
  asyncWrapper(updateProduct)
);

router.get("/all", verifyAccessKey, verifyToken, asyncWrapper(getManyProduct));

router.get(
  "/:productId",
  verifyAccessKey,
  verifyToken,
  asyncWrapper(getOneProduct)
);

router.delete(
  "/delete/:productId",
  verifyAccessKey,
  verifyToken,
  asyncWrapper(deleteProduct)
);

export default router;
