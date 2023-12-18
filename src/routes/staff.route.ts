import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
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
  validator(CreateStaff),
  asyncWrapper(createStaff)
);

router.post("/resend-otp/:userId", verifyAccessKey, asyncWrapper(resendOtp));

router.post(
  "/confirmation/otp",
  verifyAccessKey,
  asyncWrapper(verifyRegConfirmationOTP)
);

router.post("/verify-otp", verifyAccessKey, asyncWrapper(verifyOTP));

router.post("/generate-otp/:email", verifyAccessKey, asyncWrapper(generateOtp));

router.get(
  "/",
  verifyAccessKey,
  verifyToken,
  typePermit("staff", "admin", "super-admin"),
  asyncWrapper(getAllStaff)
);

router.get(
  "/total",
  verifyAccessKey,
  verifyToken,
  typePermit("staff", "admin", "super-admin"),
  asyncWrapper(getAllStaffCount)
);

router.get(
  "/:staffId",
  verifyAccessKey,
  verifyToken,
  typePermit("staff", "admin", "super-admin"),
  validator(validateParamsforStaff),
  asyncWrapper(getOneStaff)
);

router.put(
  "/info/:staffId",
  verifyAccessKey,
  verifyToken,
  typePermit("staff", "admin", "super-admin"),
  validator(updateStaff),
  asyncWrapper(updateStaffInfo)
);

router.patch(
  "/social-media/:staffId",
  verifyAccessKey,
  verifyToken,
  typePermit("staff", "admin", "super-admin"),
  validator(validateSocials),
  asyncWrapper(updateStaffSocialMedia)
);

router.delete(
  "/delete/:staffId", 
  verifyAccessKey,
  verifyToken,
  typePermit("staff", "admin", "super-admin"),
  asyncWrapper(deleteStaff)
)
export default router;
