import { Router } from "express";
import { typePermit,  verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import {
  addProduct,
  deleteProduct,
  getManyProduct,
  getOneProduct,
  updateProduct,
} from "../controller/product.controller";

const router: any = Router();

router.post("/create",  asyncWrapper(addProduct));

router.put(
  "/update/:productId",
  
  asyncWrapper(updateProduct)
);

router.get("/all",  asyncWrapper(getManyProduct));

router.get(
  "/:productId",
  
  asyncWrapper(getOneProduct)
);

router.delete(
  "/delete/:productId",
  
  asyncWrapper(deleteProduct)
);

export default router;
