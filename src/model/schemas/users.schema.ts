import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { IUser } from "./types/schema.types";
import paginate  from 'mongoose-paginate-v2';

config();

const { Schema } = mongoose;

// interface IUserModel extends Model<IUser> {
//   encryptPassword(password: any): any;
//   tempSecret(secret: any): any;
// }

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    countryCode: { type: String },
    phone: { type: String },
    avatar: { type: String },
    gender: { type: String },
    address: { type: String },
    regNo: { type: String },
    userName: { type: String },
    secretBase: { type: String },
    otpAuthUrl: { type: String },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/\S+@\S+\.\S+/, "A valid email is required."],
      lowercase: true,
      trim: true,
      unique: true,
    },
    multiFactorAuth: { type: Boolean, default: false },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required."],
    },
    otp: { type: String, select: false },
    otpTime: { type: Date, select: false },
    confirmationToken: { type: String, select: false },
    oneTimePassword: {
      type: Boolean,
      required: true,
      default: false,
    },
    firebaseNotificationToken: {
      type: String,
    },
    TCAgreement: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: { type: Boolean, default: false },
    
  },
  {
    timestamps: true,
  }
  
);


UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    this.password = (await bcrypt.hash(this.password ?? "", saltRounds)) ?? "";
    next();
  }

  next();
});

// UserSchema.statics.findToken = async function (token) {
//   return this.findOne({ firebaseNotificationToken: token });
// };

UserSchema.methods.validatePassword = function validatePassword(
  password: any
) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.firebaseNotificationToken;
    delete ret.__v;
  },
});

// UserSchema.plugin(paginate);
// const user = model<IUser>("User", UserSchema);
// export default user;

UserSchema.plugin(paginate);

interface UserDocument extends mongoose.Document, IUser {}

const user = mongoose.model<
  UserDocument,
  mongoose.PaginateModel<UserDocument>
>("Users", UserSchema, "users");

export default user;