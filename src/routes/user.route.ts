import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import {
  createUser,
  getUserByEmail,
  getAllUserCount,
  getOneUser,
  updateUserInfo,
  getAllUser,
  resendOtp,
  verifyRegConfirmationOTP,
  verifyOTP,
  generateOtp,
  deleteUser,
} from "../controller/user.controller";
import validator from "../middleware/validator";
import {
  validateCreateUser,
  validateEmail,
  validateUpdateUser,
} from "../validation/user";
import { validateId } from "../validation/allGetMethod";

const router: any = Router();

router.post(
  "/register",
  // verifyAccessKey,
  // validator(validateCreateUser),
  asyncWrapper(createUser)
);

router.get("/all", asyncWrapper(getAllUser));

router.get(
  "/email/:email",
  // verifyAccessKey,
  // verifyToken,
  // validator(validateEmail),
  asyncWrapper(getUserByEmail)
);

router.get(
  "/:userId",
  // verifyAccessKey,
  // verifyToken,
  // typePermit("user", "staff", "organization", "admin"),
  // validator(validateId),
  asyncWrapper(getOneUser)
);

router.get(
  "/count",
  // verifyAccessKey,
  // verifyToken,
  // typePermit("staff", "organization", "admin"),
  asyncWrapper(getAllUserCount)
);

router.post("/resend-otp/:userId", verifyAccessKey, asyncWrapper(resendOtp));

router.post(
  "/confirmation/otp",
  // verifyAccessKey,
  asyncWrapper(verifyRegConfirmationOTP)
);

router.post("/verify-otp", verifyAccessKey, asyncWrapper(verifyOTP));

router.post("/generate-otp/:email", verifyAccessKey, asyncWrapper(generateOtp));

router.put(
  "/update/:userId",
  // verifyAccessKey,
  // verifyToken,
  asyncWrapper(updateUserInfo)
);

router.delete(
  "/delete/:userId",
  // verifyAccessKey,
  // verifyToken,
  asyncWrapper(deleteUser)
);



export default router;
