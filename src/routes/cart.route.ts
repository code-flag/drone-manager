import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";

import validator from "../middleware/validator";
import {
  validateChangePassword,
  validateResetPassword,
  validateUserLogin,
} from "../validation/auth";
import { accessKey, askToResetPassword, changePassword, confirmResetPassword, loginUser } from "controller/auth";

const router: any = Router();

router.post(
  "/login",
//   verifyAccessKey,
  validator(validateUserLogin),
  asyncWrapper(loginUser)
);

router.post(
  "/change-password",
//   verifyAccessKey,
//   verifyToken,
  validator(validateChangePassword),
  asyncWrapper(changePassword)
);

router.post(
  "/reset-password",
//   verifyAccessKey,
  validator(validateResetPassword),
  asyncWrapper(askToResetPassword)
);

router.post(
  "/reset-password-account",
//   verifyAccessKey,
  validator(validateResetPassword),
  asyncWrapper(confirmResetPassword)
);

router.get("/access-key", asyncWrapper(accessKey));

export default router;
