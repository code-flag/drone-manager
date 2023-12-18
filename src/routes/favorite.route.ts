import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";

import { addFavorite, deleteFavorite, getUserFavoriteProduct, getUserFavoriteProductsPaginated } from "../controller/favorite.controller";

const router: any = Router();

router.post(
  "/create",
  verifyAccessKey,
  verifyToken,
  asyncWrapper(addFavorite)
);

router.get(
    "/user/:userId",
     verifyAccessKey,
     verifyToken,
    asyncWrapper(getUserFavoriteProduct)
  );

  router.get(
    "/user", 
    verifyAccessKey,
    verifyToken,
    asyncWrapper(getUserFavoriteProductsPaginated)
  );
  
router.delete("/delete/:favoriteId", 
verifyAccessKey,
verifyToken,
asyncWrapper(deleteFavorite)
);

export default router;

