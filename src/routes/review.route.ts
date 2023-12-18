import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";

import { addCategory, deleteCategory, getManyCategory, getOneCategory, updateCategory } from "controller/category.controller";
import { addReview, deleteReview, getManyReview, getOneReview, updateReview } from "controller/reviews.controller";

const router: any = Router();

router.post(
  "/create",
  asyncWrapper(addReview)
);

router.put(
  "/update/:reviewId",
  asyncWrapper(updateReview)
);

router.get(
    "/all",
    asyncWrapper(getManyReview)
);

router.get(
    "/:reviewId",
    asyncWrapper(getOneReview)
);
  
router.delete("/delete/:reviewId", asyncWrapper(deleteReview));

export default router;

