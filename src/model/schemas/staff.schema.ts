import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import {
  IStaff,
  IUpdatedBy,
} from "./types/schema.types";

config();

const { Schema } = mongoose;


const accountDetail = new Schema({
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String },
});

const UpdatedBy = new Schema<IUpdatedBy>({
  staffId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  actionLevel: { type: Number },
  desc: { type: String },
});

const staffSchema = new Schema<IStaff>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String },
    address: { type: String, required: true },
    proofOfAddress: { type: String },
    nin: { type: String },
    proofOfNIN: { type: String },
    country: { type: String, default: "Nigeria" },
    state: { type: String },
    lga: { type: String },
    department: { type: String },
    staffCode: { type: String },
    role: {
      type: String,
      enum: ["staff", "admin", "support", "accountant", "developer", "technical", "operation", "marketer", "super-admin"],
      default: "staff",
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/\S+@\S+\.\S+/, "A valid email is required."],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required."],
    },
    confirmationToken: { type: String, select: false },
    secretBase: { type: String },
    otpAuthUrl: { type: String },
    multiFactorAuth: { type: Boolean, default: false },
    oneTimePassword: {
      type: Boolean,
      required: true,
      default: true,
    },
    firebaseNotificationToken: {
      type: String,
    },
    updatedBy: [UpdatedBy],
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    this.password = (await bcrypt.hash(this.password ?? "", saltRounds)) ?? "";
    next();
  }

  next();
});

staffSchema.statics.findToken = async function (token) {
  return this.findOne({ firebaseNotificationToken: token });
};

staffSchema.methods.validatePassword = function validatePassword(
  password: any
) {
  return bcrypt.compareSync(password, this.password);
};

staffSchema.methods.encryptPassword = async function encryptPassword(
  password: any
) {
  const saltRounds = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  return bcrypt.hash(password, saltRounds);
};

staffSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.firebaseNotificationToken;
    delete ret.__v;
  },
});

staffSchema.plugin(mongoosePaginate);
const staff = mongoose.model("staff", staffSchema);
export default staff;
