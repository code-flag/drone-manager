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

router.post("/create", verifyAccessKey, asyncWrapper(addProduct));

router.put(
  "/update/:productId",
  verifyAccessKey,
  asyncWrapper(updateProduct)
);

router.get("/all", verifyAccessKey, asyncWrapper(getManyProduct));

router.get(
  "/:productId",
  verifyAccessKey,
  asyncWrapper(getOneProduct)
);

router.delete(
  "/delete/:productId",
  verifyAccessKey,
  asyncWrapper(deleteProduct)
);

export default router;
