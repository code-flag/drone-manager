import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../helper/error";
import generateAuthToken from "../helper/jwtAuth";
import { generateRandomPassword } from "../helper/random-password-generator";
import { sendMail } from "../helper/mailer";
import { returnMsg } from "../helper/message-handler";
import {Staff, User } from "../model/index.schema";
import CryptoJS from "crypto-js";
import dotEnv from "dotenv";
import { encryptPassword } from "../helper/hasher";
import { resetPasswordMsg } from "../helper/messages/resetPasswordMsg";
import { resetStaffPasswordMsg } from "../helper/messages/resetStaffPasswordMsg";
import { strReplaceAll } from "../helper/library";
dotEnv.config();

export const loginUser = async (request: any, response: any) => {
  const { email, password, userType } = request.body;
  let user: any;
  let type: number = 0;

  if (userType == "user") {
    user = await User.findOne({ email: email }, "+password");

    type = 1;
  }
  if (userType == "staff") {
    user = await Staff.findOne({ email: email }, "+password");
    type = 3;
  }

  if (userType == "admin") {
    user = await Staff.findOne({ email: email, role: "admin" }, "+password");
    type = 4;
  }

  if (!user) {
    throw new BadRequestError("Email or password do not match.");
  }

  if (!user.isActive) {
    throw new BadRequestError("Account not activated.");
  }

  if (!user.validatePassword(password, user.password)) {
    throw new BadRequestError("Email or password do not match.");
  }

  /**
   * _id and type does the same thing. _id is purposely used to confuse anyone that
   * may see the token data
   */
  let token: any = generateAuthToken({
    id: user._id,
    _id: type,
    email: user.email,
  });
  // convert mongodb return data to normal javascript object
  user = user.toObject();

  if (user?.multiFactorAuth == true) {
    token = null;
  }

  delete user["otpAuthUrl"];
  delete user["secretBase"];
  delete user["password"];

  user = token == null ? { user: user } : { user, token };
  return returnMsg(response, user, "success");
};

export const changePassword = async (request: any, response: any) => {
  const { user, staff, organization, admin, token } = request;
  const { oldPassword, newPassword, confirmPassword } = request.body;
  let userInfo: any = {};

  if (token.type == "staff") {
    if (!staff.validatePassword(oldPassword, staff.password)) {
      throw new ConflictError("Old password is incorrect.");
    }
  }
  if (token.type == "admin") {
    if (!admin.validatePassword(oldPassword, staff.password)) {
      throw new ConflictError("Old password is incorrect.");
    }
  }
  if (token.type == "user") {
    if (!user.validatePassword(oldPassword, user.password)) {
      throw new ConflictError("Old password is incorrect.");
    }
  }

  if (token.type == "organization") {
    if (!organization.validatePassword(oldPassword, organization.password)) {
      throw new ConflictError("Old password is incorrect.");
    }
  }

  if (newPassword !== confirmPassword) {
    throw new ConflictError("Passwords do not match.");
  }

  if (token.type == "user") {
    const hashedPassword = await encryptPassword(newPassword);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      oneTimePassword: false,
    });
  }
  if (token.type == "staff" || token.type == "admin") {
    const hashedPassword = await encryptPassword(newPassword);
    await Staff.findByIdAndUpdate(staff._id, {
      password: hashedPassword,
      oneTimePassword: false,
    });
  }

  //  await Activity.create({actorId: userInfo._id, actorRefPaths: user.ref, action: "change password", description: "password changed"})
  return response.status(200).json({
    status: "success",
    message: "Password updated successfully.",
  });
};

export const askToResetPassword = async (request: any, response: any) => {
  const { email, userType } = request.body;

  let password: any;

  const expirationTime = Date.now();

  if (!userType) {
    throw new BadRequestError("User type is required!");
  }

  if (userType == "user") {
    const user: any = await User.findOne({ email: email });

    if (!user) {
      throw new NotFoundError("user not found.");
    }

    const passwordResetToken: any = {
      appName: "market-place-app",
      environment: process.env.NODE_ENV,
      id: user._id,
      expirationTime: expirationTime,
      userType: userType,
    };

    const token = CryptoJS.AES.encrypt(
      JSON.stringify(passwordResetToken),
      "new-password"
    ).toString();

    const updateUserOtpDetails = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { confirmationToken: token } },
      { new: true }
    );

    if (!updateUserOtpDetails) {
      throw new NotFoundError("Something went wrong");
    }

    try {
      const msgData: any = resetPasswordMsg({
        token,
        email,
      });

      const subject = "Password Reset";

      await sendMail(email, subject, msgData.message, msgData.attachment);
    } catch (error) {
      console.log("Could not send email");
    }
  }

  if (userType == "staff" || userType == "admin") {
    const user: any = await Staff.findOne({ email: email }, "+password");

    if (!user) {
      throw new NotFoundError("Staff not found.");
    }

    const passwordResetToken: any = {
      appName: "market-place-app",
      environment: process.env.NODE_ENV,
      id: user.id,
      expirationTime,
      userType,
    };

    const token = CryptoJS.AES.encrypt(
      JSON.stringify(passwordResetToken),
      "new-password"
    ).toString();

    const updateUserOtpDetails = await Staff.findOneAndUpdate(
      { _id: user.id },
      { $set: { confirmationToken: token } },
      { new: true }
    );

    if (!updateUserOtpDetails) {
      throw new NotFoundError("Something went wrong");
    }

    try {
      const msgData: any = resetStaffPasswordMsg({
        token,
        email,
      });

      const subject = "Password Reset";

      await sendMail(email, subject, msgData.message, msgData.attachment);
    } catch (error) {
      console.log("Could not send email");
    }
  }



      returnMsg(
        response,
        [],
        "A mail has been sent to your email to confirm Reset Password, kindly check your mail"
      );
};

export const confirmResetPassword = async (req: any, res: any) => {
  let { confirmationToken } = req.query;

  let password: any;

  try {
    confirmationToken = strReplaceAll(confirmationToken, "+");
  } catch (error) {
    console.log("strReplaceAll", error);
  }

  let doc: any;

  const bytes = CryptoJS.AES.decrypt(confirmationToken, "new-password");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  const userId = decryptedData?.id;
  const userType = decryptedData?.userType;

  if (!userType) {
    throw new BadRequestError("User type is required!");
  }

  if (userType == "user") {
    doc = await User.findOne({ _id: userId }).select("+confirmationToken");

    if (!doc) {
      throw new BadRequestError("Invalid confirmation token");
    }

    if (confirmationToken != doc.confirmationToken) {
      throw new BadRequestError("Invalid confirmation token");
    }
    try {
      // check if expired
      const currentTimestamp = Date.now();

      const timeBound = currentTimestamp - decryptedData.expirationTime;

      // seting it to 10 mins expiry time
      const expiryDuration = 10 * 60 * 1000;

      if (timeBound > expiryDuration) {
        throw new ConflictError("User token expired");
      }

      password = generateRandomPassword(6);
      const hashedPassword = await encryptPassword(password);

      await User.findOneAndUpdate(
        { _id: doc.id },
        { $set: { password: hashedPassword, oneTimePassword: true } }
      );
    } catch (error: any) {
      console.log("error ", error);
      throw new BadRequestError("Ooops! could not confirm User");
    }
  }

  if (userType == "staff" || userType == "admin") {
    doc = await Staff.findOne({ _id: userId }, "+confirmationToken");

    if (!doc) {
      throw new BadRequestError("Invalid confirmation token");
    }

    if (confirmationToken !== doc.confirmationToken) {
      throw new BadRequestError("Invalid confirmation token");
    }
    try {
      // check if expired
      const currentTimestamp = Date.now();

      const timeBound = currentTimestamp - decryptedData.expirationTime;

      // seting it to 10 mins expiry time
      const expiryDuration = 10 * 60 * 1000;

      if (timeBound > expiryDuration) {
        throw new ConflictError("Token expired");
      }

      password = generateRandomPassword(6);
      const hashedPassword = await encryptPassword(password);

      await Staff.findOneAndUpdate(
        { _id: doc.id },
        { $set: { password: hashedPassword, oneTimePassword: true } }
      );
    } catch (error: any) {
      throw new BadRequestError("Ooops! could not confirm Staff");
    }
  }

  console.log(doc);
  try {
    const subject: any = "Reset Password Completed";
    const html: any = `Dear ${doc.firstName}, your new Payslate account password is ${password}. Kindly change your password after logging in`;

    await sendMail(doc?.email, subject, html);
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  return 
      returnMsg(
        res,
        "",
        "Password has been reset and the new password has been sent to your mail."
      );
};

/// login with 2FA activated
export const loginUserWith2Fa = async (request: any, response: any) => {
  const { email, password, userType } = request.body;
  let user: any;
  let type: number = 0;

  if (userType == "user") {
    user = await User.findOne({ email: email }, "+password");
    type = 1;
  }
};

export const accessKey = async (request: any, response: any) => {
  const tokenData: any = {
    appName: "market-place-app",
    environment: process.env.NODE_ENV,
    lock: Date.now(),
  };
  const newToken = CryptoJS.AES.encrypt(
    JSON.stringify(tokenData),
    process.env.ACCESS_SEC_KEY ?? ""
  ).toString();
  return returnMsg(response, newToken, "");
};
