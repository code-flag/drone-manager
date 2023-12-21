import { Staff } from "../model/index.schema";
import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { regConfirmationMsg } from "../helper/messages/reg-confirmation";
import { sendMail } from "../helper/mailer";
import { generateOTP } from "../helper/generate-otp";
import { otpConfirmationMsg } from "../helper/messages/otp-confirmation-message";

export const createStaff = async (req: any, res: any) => {
  const staffData: any = req.body;

  const findStaff: any = await Staff.findOne({ email: staffData.email });

  if (findStaff) {
    throw new ConflictError("Staff already exist");
  }

  const otp = await generateOTP();
  const otpTime = new Date();
  staffData["otp"] = otp;
  staffData["otpTime"] = otpTime;

  // create new staff
  let newStaff: any = await Staff.create(staffData);

  if (!newStaff) {
    throw new BadRequestError("Something went wrong");
  }

  try {
    const msgData: any = regConfirmationMsg({
      otp: otp,
      firstName: staffData.firstName,
    });
    const subject = "Email Confirmation";

    await sendMail(
      staffData.email,
      subject,
      msgData.message,
      msgData.attachment
    );
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  newStaff = newStaff.toObject();

  delete newStaff.otp;
  delete newStaff.otpTime;
  delete newStaff.password;

  returnMsg(res, newStaff, "Staff created successfully");
};

export const getAllStaff = async (req: any, res: any) => {
  const allStaff: any = await Staff.find();

  if (!allStaff) {
    throw new NotFoundError("No staff was found");
  }

  returnMsg(res, allStaff, "All staffs retrieved successfully");
};

export const getAllStaffCount = async (req: any, res: any) => {
  const allStaff: any = await Staff.count();

  if (!allStaff) {
    throw new NotFoundError("No staff was found");
  }

  returnMsg(res, allStaff, "All staffs retrieved successfully");
};

export const getOneStaff = async (req: any, res: any) => {
  const { staffId } = req.params;

  const staff: any = await Staff.find({ _id: staffId });

  if (!staff) {
    throw new NotFoundError("staff not found");
  }

  returnMsg(res, staff, "Staffs retrieved successfully");
};

export const updateStaffSocialMedia = async (req: any, res: any) => {
  const { staffId } = req.params;
  // check if user exist
  const staff: any = await Staff.find({ _id: staffId });

  if (!staff) {
    throw new NotFoundError("staff not found");
  }

  const dbResponse = await Staff.findOneAndUpdate(
    { _id: staffId },
    { $addToSet: { socialMedia: req.body } },
    { new: true }
  );

  returnMsg(res, dbResponse, "Staff social media account added successfully");
};

export const updateStaffInfo = async (req: any, res: any) => {
  const { staffId } = req.params;
  // check if user exist
  const staff: any = await Staff.find({ _id: staffId });

  if (!staff) {
    throw new NotFoundError("staff not found");
  }

  const dbResponse = await Staff.findOneAndUpdate(
    { _id: staffId },
    { $set: req.body },
    { new: true }
  );

  returnMsg(res, dbResponse, "Staff data updated successfully");
};

export const resendOtp = async (req: any, res: any) => {
  const { staffId } = req.params;
  const otp = await generateOTP();
  const otpTime = new Date();

  const findStaff: any = await Staff.findOne({
    _id: staffId,
  });

  if (!findStaff) {
    throw new ConflictError("User does not exist");
  }

  const updateUser = await Staff.findOneAndUpdate(
    { _id: staffId },
    {
      $set: { otp: otp, otpTime: otpTime },
    }
  );

  if (!updateUser) {
    throw new BadRequestError("Something went wrong");
  }

  try {
    const msgData: any = regConfirmationMsg({
      otp: otp,
      firstName: findStaff.userName,
    });
    const subject: any = "Email Confirmation OTP";
    await sendMail(
      findStaff.email,
      subject,
      msgData.message,
      msgData.attachment
    );
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  returnMsg(res, "", "Otp sent successfully");
};

export const generateOtp = async (req: any, res: any) => {
  const { email } = req.params;
  const otp = await generateOTP();
  const otpTime = new Date();

  const findStaff: any = await Staff.findOne({
    email: email,
  });

  if (!findStaff) {
    throw new ConflictError("User does not exist");
  }

  const updateUser = await Staff.findOneAndUpdate(
    { email: email },
    {
      $set: { otp: otp, otpTime: otpTime },
    }
  );

  if (!updateUser) {
    throw new BadRequestError("Something went wrong");
  }

  try {
    const msgData: any = `Hi ${findStaff.firstName},
        <p>Below is your One time Pin (OTP). It only valid for 15min. </p>
  
        <b> ${otp} </b>
  
        <p> Note: This pin should only be used directly by you and never to be reveal to anyone. Keep it safe.</p>
      
      `;
    const subject: any = "Huiospay OTP";
    await sendMail(email, subject, msgData);
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  returnMsg(res, "", "Otp sent successfully");
};
export const verifyOTP = async (req: any, res: any) => {
  const { otp, email } = req.query;

  const doc: any = await Staff.findOne({ email: email }, "+otp +otpTime");

  if (!doc) {
    throw new NotFoundError("User does not exist");
  }
  if (doc.otp !== otp) {
    throw new NotFoundError("Invalid OTP");
  }
  let timeNow = new Date();
  // get the time difference
  const duration = (timeNow.getTime() - doc?.otpTime?.getTime()) / 60000; // convert to minutes

  // check if the number is not greater than 15min
  if (duration > 15) {
    throw new BadRequestError("OTP has expired. Kindly request new otp.");
  }

  returnMsg(res, "", "OTP confirmed");
};

export const verifyRegConfirmationOTP = async (req: any, res: any) => {
  const { otp, staffId } = req.params;

  const doc: any = await Staff.findOne({ _id: staffId }, "+otp +otpTime");

  if (!doc) {
    throw new NotFoundError("User does not exist");
  }
  if (doc.otp !== otp) {
    throw new NotFoundError("Invalid OTP");
  }
  let timeNow = new Date();
  // get the time difference
  const duration = (timeNow.getTime() - doc?.otpTime?.getTime()) / 60000; // convert to minutes

  // check if the number is not greater than 15min
  if (duration > 15) {
    throw new BadRequestError("OTP has expired. Kindly request new otp.");
  }

  await Staff.findOneAndUpdate({ _id: staffId }, { $set: { isActive: true } });

  try {
    const subject: any = "Registration Completed";
    const html: any = otpConfirmationMsg({ name: doc.userName });
    await sendMail(doc.email, subject, html.message, html.attachment);
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  returnMsg(res, "", "Registration confirmed");
};

export const deleteStaff = async (req: any, res: any) => {
  const { staffId } = req.params;

  const findStaff: any = await Staff.findOne({
    _id: staffId,
  });

  if (!findStaff) {
    throw new NotFoundError("User not found");
  }

  const resp: any = await Staff.findOneAndRemove({
    _id: staffId,
  });

  if (!resp) {
    throw new BadRequestError("Unable to delete User");
  }

  returnMsg(res, "", "User deleted successfully");
};
