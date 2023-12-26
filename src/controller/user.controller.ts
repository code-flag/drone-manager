import { sendMail } from "../helper/mailer";
import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Shipping, User } from "../model/index.schema";
import { otpConfirmationMsg } from "../helper/messages/otp-confirmation-message";
import { regConfirmationMsg } from "../helper/messages/reg-confirmation";
import { generateOTP } from "../helper/generate-otp";

export const createUser = async (req: any, res: any) => {
  const userData: any = req.body;

  const findUser: any = await User.findOne({ email: userData.email });

  if (findUser) {
    throw new ConflictError("User already exist");
  }

  const otp = await generateOTP();
  const otpTime = new Date();
  userData["otp"] = otp;
  userData["otpTime"] = otpTime;

  // create new user
  let newUser: any = await User.create(userData);

  if (!newUser) {
    throw new BadRequestError("Something went wrong");
  }

  try {
    const msgData: any = regConfirmationMsg({
      otp: otp,
      firstName: userData.userName,
    });
    const subject = "Email Confirmation";

    await sendMail(
      userData.email,
      subject,
      msgData.message,
      msgData.attachment
    );
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  newUser = newUser.toObject();

  delete newUser.otp;
  delete newUser.otpTime;
  delete newUser.password;

  try {
    await Shipping.create({userId: newUser._id, phone: userData.phone, address: userData.address, email: userData.email})

  } catch (error) {
    console.log("could not save user contact to shipping database");
    
  }
  returnMsg(res,{ newUser }, "user created successfully");
};

export const getAllUser = async (request: any, response: any) => {
  const {
    limit = 10,
    offset = 0,
    //   isActive = true,
    isDeleted = false,
    isActive,
    search,
    email,
    fromDate,
    toDate,
  } = request.query;

  const matchQuery: any = { };

  if (email) {
    matchQuery["email"] = email;
  }

  if (isActive) {
    matchQuery["isActive"] = isActive;
  }

  if (search) {
    matchQuery["$or"] = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  /** search for created or registered user */
  if (fromDate && toDate) {
    matchQuery["createdAt"] = {
      $gte: new Date(`${fromDate}`).toISOString(),
      $lt: new Date(`${toDate}`).toISOString(),
    };
  }

  User.paginate(matchQuery, {
    limit: limit,
    offset: offset,
    sort: {
      createdAt: -1,
      _id: 1
    },
  }).then((user: any) => {
    return  returnMsg(response,
        {
          result: user.docs,
          totalCount: user.totalDocs,
        },
        "Fetch all user data completed"
    )
  });
};

export const getAllUserCount = async (req: any, res: any) => {
  const allUser: any = await User.count();

  if (!allUser) {
    throw new NotFoundError("No User was found");
  }

  returnMsg(res,allUser, "All users retrieved successfully");
};

export const getOneUser = async (req: any, res: any) => {
  const { userId } = req.params;

  const user: any = await User.find({ _id: userId });

  if (!user) {
    throw new NotFoundError("user not found");
  }

  returnMsg(res,user, "User retrieved successfully");
};

export const getUserByEmail = async (req: any, res: any) => {
  const { email } = req.params;
  const user: any = await User.findOne({ email: email, isDeleted: false });

  if (!user) {
    throw new BadRequestError("User not found.");
  }

  return returnMsg(res,user, "User retrieved successfully");
};

export const updateUserInfo = async (req: any, res: any) => {
  const { userId } = req.params;
  // check if user exist
  const user: any = await User.find({ _id: userId });

  if (!user) {
    throw new NotFoundError("user not found");
  }

  const dbResponse = await User.findOneAndUpdate(
    { _id: userId },
    { $set: req.body },
    { new: true }
  );

  returnMsg(res,dbResponse, "User data updated successfully");
};

export const resendOtp = async (req: any, res: any) => {
  const { userId } = req.params;
  const otp = await generateOTP();
  const otpTime = new Date();

  const findUser: any = await User.findOne({
    _id: userId,
  });

  if (!findUser) {
    throw new ConflictError("User does not exist");
  }

  const updateUser = await User.findOneAndUpdate(
    { _id: userId },
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
      firstName: findUser.userName,
    });
    const subject: any = "Email Confirmation OTP";
    await sendMail(findUser.email, subject, msgData.message);
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  returnMsg(res,"", "Otp sent successfully");
};

export const generateOtp = async (req: any, res: any) => {
  const { email } = req.params;
  const otp = await generateOTP();
  const otpTime = new Date();

  const findUser: any = await User.findOne({
    email: email,
  });

  if (!findUser) {
    throw new ConflictError("User does not exist");
  }

  const updateUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: { otp: otp, otpTime: otpTime },
    }
  );

  if (!updateUser) {
    throw new BadRequestError("Something went wrong");
  }

  try {
    const msgData: any = `Hi ${findUser.firstName},
      <p>Below is your One time Pin (OTP). It only valid for 15min. </p>

      <b> ${otp} </b>

      <p> Note: This pin should only be used directly by you and never to be reveal to anyone. Keep it safe.</p>
    
    `;
    const subject: any = "Huiospay OTP";
    await sendMail(email, subject, msgData);
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  returnMsg(res,"", "Otp sent successfully");
};
export const verifyOTP = async (req: any, res: any) => {
  const { otp, email } = req.query;

  const doc: any = await User.findOne({ email: email }, "+otp +otpTime");

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

  returnMsg(res,"", "OTP confirmed");
};

export const verifyRegConfirmationOTP = async (req: any, res: any) => {
  const { otp, userId } = req.params;

  const doc: any = await User.findOne({ _id: userId }, "+otp +otpTime");

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

  await User.findOneAndUpdate({ _id: userId }, { $set: { isActive: true } });

  try {
    const subject: any = "Registration Completed";
    const html: any = otpConfirmationMsg({ name: doc.userName });
    await sendMail(doc.email, subject, html.message, html.attachment);
  } catch (error) {
    console.log("Could not send confirmation email");
  }

  returnMsg(res,"", "Registration confirmed");
};

export const deleteUser = async (req: any, res: any) => {
  const { userId } = req.params;

  const findUser: any = await User.findOne({
    _id: userId,
  });

  if (!findUser) {
    throw new NotFoundError("User not found");
  }

  const resp: any = await User.findOneAndRemove({
    _id: userId,
  });

  if (!resp) {
    throw new BadRequestError("Unable to delete User");
  }

  returnMsg(res,"", "User deleted successfully");
};
