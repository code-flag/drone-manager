import { getUniqueId } from "../helper/unique-id";
import { BadRequestError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import {
    Order,
  Transactions,
  User,
} from "../model/index.schema";
import { getUserAddedPerMonth } from "../helper/library";

export const addTransaction = async (request: any, response: any) => {
  
};

export const filterTransactions = async (request: any, response: any) => {
  const {
    limit = 10,
    offset = 0,
    //   isActive = true,
    search,
    status,
    userId,
    orderId,
    transactionId,
    referenceId,
    category,
    fromDate,
    toDate,
  } = request.query;

  const matchQuery: any = {};

  if (status) {
    matchQuery["status"] = status;
  }
  if (userId) {
    matchQuery["userId"] = userId;
  }
  if (orderId) {
    matchQuery["orderId"] = orderId;
  }
  if (category) {
    matchQuery["OrderCategory"] = category;
  }
  if (transactionId) {
    matchQuery["_id"] = transactionId;
  }
  if (referenceId) {
    matchQuery["reference"] = referenceId;
  }

  if (search) {
    matchQuery["$or"] = [
      { regNo: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
      { reference: { $regex: search, $options: "i" } },
      { naration: { $regex: search, $options: "i" } },
      { OrganizationCategory: { $regex: search, $options: "i" } },
      { userId: { $regex: search, $options: "i" } },
      { orderId: { $regex: search, $options: "i" } },
      { reference: { $regex: search, $options: "i" } },
    ];
  }

  /** this help us to search student by date created or registered */
  if (fromDate && toDate) {
    matchQuery["createdAt"] = {
      $gte: new Date(`${fromDate}`).toISOString(),
      $lt: new Date(`${toDate}`).toISOString(),
    };
  }

  Transactions.paginate(matchQuery, {
    populate: [
      {
        path: "orderId",
        select:
          "name logo tradename legalName industry category organizationCode isApproved",
      },
    ],
    limit: limit,
    offset: offset,
    sort: {
      createdAt: -1,
      _id: 1
    },
  }).then((txn: any) => {
  returnMsg(response, 
        {
          result: txn.docs,
          totalCount: txn.totalDocs,
        },
        "Transactions retrieved successfully"
      )
  });
};


export const updateTransactionStatus = async (request: any, response: any) => {
  const { staff, admin } = request;
  const { id } = request.params;
  const txn = await Transactions.find({ _id: id });

  if (!txn) {
    throw new NotFoundError("Transaction does not exist");
  }

  const result = await Transactions.findOneAndUpdate(
    { _id: id },
    {
      $set: { status: request.body.status },
    },
    { new: true }
  );

  if (result && staff) {
    const staffData = {
      staffId: staff._id,
      desc: "update user transaction",
      actionLevel: "2",
    };
    await Transactions.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: { update: staffData },
      },
      { new: true }
    );
  }

 returnMsg(response, result, "Transactions status updated successfully");
};

