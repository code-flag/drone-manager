import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { generateAuthToken } from '../helper/jwtAuth';
import { Staff, User } from '../model/index.schema';



// when user toggles to activate 2FA
export const Activate2Fa =  async (req: any, res: any) => {
    const { userId, userType } = req.query;
  
    const secret =  speakeasy.generateSecret();

    let findUser: any ; 
    if (userType === 'user') {
      findUser = await User.findOne({ _id: userId});
    }
    if (userType === 'staff' || userType === 'admin') {
      findUser = await Staff.findOne({ _id: userId});
    }
    
    if (!findUser) {
        throw new NotFoundError("Unable to generate Secret for this user");
    }

    const otpauth_url: any = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: 'Market_Place',
    issuer: `Market_Place-${userType} 2FA`,
      });

      // Generate a QR code image and send it as a response
      QRCode.toDataURL(otpauth_url, async (err: any, data_url: any) => {
      if (err) {
        throw new BadRequestError("Could not generate qrcode");
      } 

      const userData: any = {"otpAuthUrl": otpauth_url};
      userData["secretBase"] = secret.base32;

      if (userType === 'user') {
        findUser =  await User.findOneAndUpdate({_id: userId}, {$set: userData}, {new: true})
      }
      if (userType === 'staff' || userType === 'admin') {
        findUser =  await Staff.findOneAndUpdate({_id: userId}, {$set: userData}, {new: true})
      }
      
      if (!findUser) {
          throw new NotFoundError("Unable to generate Secret for this user");
      }
          
      returnMsg(res, {MFAQrcode: data_url},  "User Secret generated successfully");
    });
};

// Define a function for token validation
export const validateToken = async (req: any, res: any) => {
  const { userId, userType, token} = req.body;

  let findUser: any;

  if (userType === 'user') {
    findUser = await User.findOne({ _id: userId});
  }
  if (userType === 'staff' || userType === 'admin') {
    findUser = await Staff.findOne({ _id: userId});
  }

  if (!findUser) {
    throw new NotFoundError("Unable to generate Secret for this user");
}

const tokenValidates: boolean = speakeasy.totp.verify({
  secret: findUser?.secretBase,
  encoding: 'base32',
  token: token,
  window: 6, // Number of 30-second windows to check (adjust as needed)
});

if (!tokenValidates) {
  throw new BadRequestError("could not validate token")
}

let UserToken: any;

if (findUser.multiFactorAuth === true) {
    UserToken = generateAuthToken({
    id: findUser._id,
    _id: userType,
    email: findUser.email,
  });
}
else {
  
  if (userType === 'user') {
    findUser =  await User.findOneAndUpdate({_id: userId}, {$set: {"multiFactorAuth": true}}, {new: true})
  }
  if (userType === 'staff' || userType === 'admin') {
    findUser =  await Staff.findOneAndUpdate({_id: userId}, {$set: {"multiFactorAuth": true}}, {new: true})
  }
  
}


returnMsg(res, {MFAQrcode:  tokenValidates, token: UserToken },  "Token validated successfuly");

};
// Returns true if the token matches
