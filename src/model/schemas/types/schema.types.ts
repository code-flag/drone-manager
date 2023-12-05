import { Types } from "mongoose";


export interface IUpdatedBy {
  staffId: Types.ObjectId;
  actionLevel: number;
  desc: string;
}

export interface IStaff {
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  address: string;
  proofOfAddress?: string;
  nin?: string;
  proofOfNIN?: string;
  role?: string;
  email: string;
  password: string;
  country?: string;
  state?: string;
  lga?: string;
  socialMedia: [{ type: String }];
  department: string;
  staffCode: string;
  confirmationToken: string;
  secretBase: string;
  multiFactorAuth: boolean;
  otpAuthUrl: string;
  oneTimePassword: boolean;
  firebaseNotificationToken?: string;
  updatedBy: any;
  isDeleted: boolean;
  isActive: boolean;
}

export interface IUser {
  organizationId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  userName: string;
  countryCode: string;
  phone: string;
  avatar: string;
  gender?: string;
  address?: string;
  email: string;
  regNo?: string;
  multiFactorAuth?: boolean;
  secretBase: string;
  otpAuthUrl: string;
  role?: string;
  businesses?: [Types.ObjectId];
  password: string;
  otp: string;
  confirmationToken: string;
  otpTime: Date;
  oneTimePassword: boolean;
  firebaseNotificationToken?: string;
  TCAgreement: boolean;
  isDeleted: boolean;
  isActive: boolean;
}

export interface IContact {
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ITransaction {
  orderId: Types.ObjectId;
  fullName: string;
  regNo?: string;
  userId?: string;
  status: string;
  amount: number;
  naration: string;
  /** @property purpose - this is used to include details of what the payer is paying for */
  purpose: [any];
  /** this could be returned reference id from huiospay * */
  reference?: string;
  updatedBy?: [any];
}

export interface ICategory {
  category: string;
  charges: string;
}

export interface IAggregator {
  firstName: string;
  lastName: string;
  userName: string;
  countryCode: string;
  phone: string;
  avatar: string;
  gender?: string;
  address?: string;
  email: string;
  referralId?: string;
  organization?: [Types.ObjectId];
  multiFactorAuth?: boolean;
  secretBase: string;
  otpAuthUrl: string;
  role?: string;
  businesses?: [Types.ObjectId];
  password: string;
  otp: string;
  confirmationToken: string;
  otpTime: Date;
  oneTimePassword: boolean;
  firebaseNotificationToken?: string;
  TCAgreement: boolean;
  isDeleted: boolean;
  isActive: boolean;
  isApproved: boolean;
}
