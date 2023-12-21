import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";

import { addCategory, deleteCategory, getCategoryByType, getManyCategory, getOneCategory, updateCategory } from "../controller/category.controller";

const router: any = Router();

router.post(
  "/create",
  asyncWrapper(addCategory)
);

router.put(
  "/update/:categoryId",
  asyncWrapper(updateCategory)
);

router.get(
    "/all",
    asyncWrapper(getManyCategory)
  );
  router.get(
    "/type/:type",
    asyncWrapper(getCategoryByType)
  );
  router.get(
    "/:categoryId",
    asyncWrapper(getOneCategory)
  );
  
router.delete("/delete/:categoryId", asyncWrapper(deleteCategory));

export default router;

