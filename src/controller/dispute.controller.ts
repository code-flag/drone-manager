import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { sendMail } from "../helper/mailer";
import { generateDisputeTicketID } from "../helper/unique-id";
import Dispute from "../model/schemas/dispute.schema";
import { Order } from "model/index.schema";

export const createDispute = async (req: any, res: any) => {
  const disputeData: any = req.body;

  if (!disputeData.userType) {
    throw new BadRequestError("User type must be specified");
  }

  const ticketId = await generateDisputeTicketID();

  let existingOrder: any;
  // Check if order id matches any order id in Order collection
  try {
    existingOrder = await Order.findOne({
      _id: disputeData?.trx_reference,
    }).populate([
      { path: "userId", select: "firstName lastName email avatar" },
      { path: "productId", select: "category subCategory" },
    ]);
  } catch (error) {
    console.log("error ", error);

    throw new BadRequestError("Invalid Order id");
  }
  if (!existingOrder) {
    throw new BadRequestError(
      "Order not found for the given trx_reference"
    );
  }

  const userName = `${existingOrder?.userId?.firstName} ${existingOrder?.userId.lastName}`;
  const userId = existingOrder?.userId?._id;
  const email = existingOrder?.userId?.email;

  const insertData = {
    userId: userId,
    disputeTicketId: "MP" + ticketId,
    description: disputeData.description,
    disputeCategory: existingOrder.subCategoryId ?? existingOrder.categoryId,
    userName: userName,
    orderId: disputeData.orderId,
    email: email,
    image: disputeData?.avatar ?? null,
  };

  // Create new Dispute
  let newDispute: any = await Dispute.create(insertData);

  if (!newDispute) {
    throw new BadRequestError("Oops!! Something went wrong");
  }
  // send dispute notification email
  try {
    const subject = "Dispute Email Confirmation (Market Place)";
    const msg = `Dear Esteemed Customer, 
      <p>We have received your dispute request our support team will begin looking into it and resolve as soon as possible. 
      Your dispute ticketID is <b> ${newDispute.disputeTicketId} </b>. 
      Please feel free to use this code to track your complain and get status.</p>
      <p> Thank you for choosing Market Place</p>`;

    await sendMail(newDispute.email, subject, msg);
  } catch (error) {
    console.log("Could not send dispute confirmation email");
  }
  return returnMsg(res, { newDispute }, "New dispute created successfully");
};

// get dispute by ticketId
export const getDisputeByTicketId = async (req: any, res: any) => {
  const { disputeTicketId } = req.params;
  const dispute = await Dispute.findOne({ disputeTicketId: disputeTicketId });
  if (!dispute) {
    throw new NotFoundError("Dispute with this ID not found");
  }
  return returnMsg(res, dispute, "Dispute retrieved successfully");
};

// get dispute by userId
export const getDisputeByUserId = async (req: any, res: any) => {
  const { userId } = req.params;
  const getUserId = await Dispute.findOne({ userId: userId });
  if (!getUserId) {
    throw new NotFoundError("Dispute with this userID not found");
  }
  return returnMsg(res, getUserId, "User with Dispute retrieved successfully");
};

export const getAllDisputes = async (req: any, res: any) => {
  const {
    limit = 10,
    offset = 0,
    status,
    resolveComment,
    search,
    disputeTicketId,
    email,
    fromDate,
    toDate,
    userId,
    productCategoryId,
    orderId,
  } = req.query;

  const matchQuery: any = {};

  if (email) {
    matchQuery["email"] = email;
  }

  if (userId) {
    matchQuery["userId"] = userId;
  }

  if (productCategoryId) {
    matchQuery["productCategoryId"] = productCategoryId;
  }

  if (status) {
    matchQuery["status"] = status;
  }

  if (resolveComment) {
    matchQuery["resolveComment"] = resolveComment;
  }

  if (disputeTicketId) {
    matchQuery["disputeTicketId"] = disputeTicketId;
  }

  if (orderId) {
    matchQuery["orderId"] = orderId;
  }

  /** search dispute by date created */
  if (fromDate && toDate) {
    matchQuery["createdAt"] = {
      $gte: new Date(`${fromDate}`).toISOString(),
      $lt: new Date(`${toDate}`).toISOString(),
    };
  }

  if (search) {
    matchQuery["$or"] = [
      { disputeTicketId: { $regex: search, $options: "i" } },
    ];
  }

  Dispute.paginate(matchQuery, {
    populate: [ "orderId.userId", "orderId.productId"],
    limit: limit,
    offset: offset,
    sort: {
      _id: 1,
      createdAt: 1,
    },
  }).then((dispute: any) => {
    return returnMsg(
      res,
      {
        result: dispute.docs,
        totalCount: dispute.totalDocs,
      },
      "Fetched all unresolved dispute data completed"
    );
  });
};

export const adminResolution = async (req: any, res: any) => {
  const { staff, admin } = req;
  let staffData: any = staff ?? admin;

  const { resolveComment, disputeTicketId } = req.body;

  if (!resolveComment || resolveComment == "") {
    throw new BadRequestError("resolve comment is required!");
  }

  const findTrxRef = await Dispute.findOne({
    disputeTicketId: disputeTicketId,
  });
  if (!findTrxRef) {
    throw new NotFoundError("No dispute found");
  }

  let newStatus: any = null;
  if (staffData) {
    staffData = {
      staffId: staffData._id,
      actionLevel: 5,
      desc: "Attended to dispute",
    };

    newStatus = await Dispute.findOneAndUpdate(
      { disputeTicketId: disputeTicketId },
      {
        $set: { resolveComment: resolveComment, status: true },
        $addToSet: { updatedBy: staffData },
      },
      { new: true }
    );
  } else {
    newStatus = await Dispute.findOneAndUpdate(
      { disputeTicketId: disputeTicketId },
      { $set: { resolveComment: resolveComment, status: true } },
      { new: true }
    );
  }

  if (!newStatus) {
    throw new BadRequestError("Failed to update dispute status");
  }
  returnMsg(res, newStatus, "Dispute is resolved successfully");
};
