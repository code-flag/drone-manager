import asyncWrapper from "./asyncWrapper";
import jwt from "jsonwebtoken";

import {
  ApplicationError,
  BadRequestError,
  ForbiddenError,
  RequestTimeoutError,
  UnauthorizedError,
} from "../helper/error";
import CryptoJS from "crypto-js";
import dotEnv from 'dotenv';
import { Staff, User} from "../model/index.schema";
dotEnv.config();


export const verifyAccessKey = asyncWrapper(async (request: any, response: any, next: any) => {
  const { accesskey } = request.headers;

  if (!accesskey) {
    throw new UnauthorizedError("Access denied");
  }
  // check if access token is valid
  try {
    const bytes = CryptoJS.AES.decrypt(accesskey, process.env.ACCESS_SEC_KEY ?? '');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const accessTimer = decryptedData?.lock ? Math.floor(Date.now() - decryptedData?.lock) / 1000 : 1000;
    if (accessTimer < 1) {
      return next(new ForbiddenError("Invalid access key"));
    }
  } catch (error) {
    throw new ForbiddenError("Access denied (AK)");
  }
  return next();
});

export const verifyToken = asyncWrapper(async (request: any, response: any, next: any) => {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new UnauthorizedError("No token provided.");
  }

  let token;

  if (authorization.startsWith("Bearer ")) {
    [, token] = authorization.split(" ");
  } else {
    token = authorization;
  }

  jwt.verify(token, process.env.JWT_SECRET ?? "", async (error: any, decoded: any) => {
    if (error) {
      if ((error as Error).name == "TokenExpiredError") {
        return next(new RequestTimeoutError("Token expired!!!"));
      }
      else {
        return next(new UnauthorizedError("Invalid token. Authorization failed!"));
      }
    }
    
    // value 1 is for user
    if (decoded._id === 1 || decoded?._id === "user") { 
      const user: any = await User.findById(decoded?.id, "+password");
      if (!user) {
        return next(new UnauthorizedError("Invalid User token."));
      }
      request.user = user;
      request.token = {
        type: "user",
        role: user?.role ?? null,
        accessLevel: user?.accessLevel ?? "user",
      };
    }
     // value 3 is for staff
     if (decoded._id === 3 || decoded?._id === "staff") {
      const staff: any = await Staff.findById(decoded?.id, "+password");
      if (!staff) {
        return next(new UnauthorizedError("Invalid Staff token."));
      }
      request.staff = staff;
      request.token = {
        type: "staff",
        role: staff?.role ?? "staff",
        accessLevel: staff.accessLevel,
      };
    }
    // value 4 is for admin
    if (decoded._id === 4 || decoded?._id === "admin" || decoded?._id === "super-admin") {
      const admin: any = await Staff.findById(decoded?.id, "+password");
      if (!admin) {
        return next(new UnauthorizedError("Invalid Admin token."));
      }
      request.admin = admin;
      request.token = {
        type: "staff",
        role: admin?.role ?? "admin",
        accessLevel: admin.accessLevel,
      };
    }
    return next();
  });
});

export const accessLevelPermit =
  (...permitted: any) =>
    (request: any, response: any, next: any) => {
      if (
        request.token &&
        request.token.accessLevel &&
        permitted.indexOf(request.token.accessLevel) !== -1
      ) {
        return next();
      }
      // this occur when the user accessLevel is not allowed
      // throw new ApplicationError(403, "Access denied. (ALP)");
    };

export const typePermit =
  (...permitted: any) =>
    (request: any, response: any, next: any) => {
      
      if (
        request.token &&
        request.token.type &&
        permitted.indexOf(request.token.type) !== -1
      ) {
        return next();
      }

      // this occur when the user is not actve or isActive field is false
      throw new ApplicationError(403, "Access denied. (TP)");
    };

export const rolePermit =
  (...permitted: any) =>
    (request: any, response: any, next: any) => {
      if (
        request.token &&
        request.token.role &&
        permitted.indexOf(request.token.role) !== -1
      ) {
        return next();
      }
      // this occur when the user doesn't have the permitted role
      // throw new ApplicationError(403, "Access denied. (RP)");
    };

