import { Router } from "express";
import { typePermit, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import validator from "../middleware/validator";
import {
  createStaff,
  deleteStaff,
  generateOtp,
  getAllStaff,
  getAllStaffCount,
  getOneStaff,
  resendOtp,
  updateStaffInfo,
  updateStaffSocialMedia,
  verifyOTP,
  verifyRegConfirmationOTP,
} from "../controller/staff.controller";
import {
  CreateStaff,
  updateStaff,
  validateSocials,
  validateParamsforStaff,
} from "../validation/staff";

const router: any = Router();

router.post(
  "/",
  // verifyAccessKey,
  // validator(CreateStaff),
  asyncWrapper(createStaff)
);

router.post("/resend-otp/:userId", asyncWrapper(resendOtp));

router.post(
  "/confirmation/otp",
  asyncWrapper(verifyRegConfirmationOTP)
);

router.post("/verify-otp", asyncWrapper(verifyOTP));

router.post("/generate-otp/:email", asyncWrapper(generateOtp));

router.get(
  "/",
  // verifyAccessKey,
  // verifyToken,
  asyncWrapper(getAllStaff)
);

router.get(
  "/total",
  // verifyAccessKey,
  // verifyToken,
  asyncWrapper(getAllStaffCount)
);

router.get(
  "/:staffId",
  // verifyAccessKey,
  // verifyToken,
  asyncWrapper(getOneStaff)
);

router.put(
  "/info/:staffId",
  // verifyAccessKey,
  // verifyToken,

  asyncWrapper(updateStaffInfo)
);

router.patch(
  "/social-media/:staffId",
  // verifyAccessKey,
  // verifyToken,

  asyncWrapper(updateStaffSocialMedia)
);

router.delete(
  "/delete/:staffId", 
  // verifyAccessKey,
  // verifyToken,
  asyncWrapper(deleteStaff)
)
export default router;
