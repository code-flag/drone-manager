import { getUniqueId } from "../helper/unique-id";
import { BadRequestError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import {
    Order,
  Product,
  Transactions,
  User,
} from "../model/index.schema";
// import { getUserAddedPerMonth } from "../helper/library";
import dotEnv  from 'dotenv';

dotEnv.config();
const pkid: string = process.env.PAYMENT_PRIVATE_KEY ?? "";
const stripe = require('stripe')(pkid);

interface ITxnData {
  amount: number,
    userId: string,
    itemId: string[],
    fullName: string,
    narration: string
}

export const addTransaction = async (req: any, res: any) => {
  const {amount, userId, items, shippingAddress} = req.body;
  if (!userId || !items || !amount) {
    throw new BadRequestError("User Id, items, and amount are required");
  }

  const userData = await User.findOne({_id: userId});
  if (!userData) {
    throw new BadRequestError("User not found");
  }

  const txnData: ITxnData = {
    amount: amount,
    userId: userId,
    itemId: items,
    fullName: `${userData.firstName} ${userData.lastName}`,
    narration: "payment for products"
  }
  const savedTxnData = await Transactions.create(txnData);

  
  if (!savedTxnData) {
    throw new BadRequestError("Transaction failed. Please try again");
  }

  const domain = "https://market-place-orcin.vercel.app/Home"
  const session: any = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product_data: {
            name: "array of product"
          },
          // price in cent
          unit_amount: amount * 100 
        },
        quantity: items.length,
      },
    ],
    payment_method_types: ["card"],
    mode: 'payment',
    customer_email: userData.email,
    client_reference_id: savedTxnData._id,
    metadata: {
      items: items.join(" "),
      userId: userData._id,
      narration: "payment for products",
    },
    success_url: `${domain}/success/${savedTxnData._id}`,
    cancel_url: `${domain}/cancel/${savedTxnData._id}`,
  });

 let updatedTxnData: any = {};

  if (session) {
    await Transactions.findOneAndUpdate({_id: savedTxnData._id},
       {$set: {reference: session.id},      }, 
       {new: true}
       );

       updatedTxnData["data"] = await Transactions.findOne({_id: savedTxnData._id});
  }

  const orderData: any = await Promise.all( items.map(async (productId: string) => {
    const prd: any = await Product.findOne({_id: productId});
    return {
      userId: userId,
      productId: productId,
      price: prd.basePrice,
      // price: prd.discountPrice,
      paymentId: savedTxnData._id,
      shippingAddress: shippingAddress,
      quantity: 1,
      isTracking: false
    }
  })) 

  // save order data 
  console.log("orderData ", orderData)
  await Order.insertMany(orderData);

  updatedTxnData["paymentUrl"] = session.url;
  returnMsg(res, updatedTxnData , "Transaction initiated successfully.");
};

export const filterTransactions = async (req: any, res: any) => {
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
  } = req.query;

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
  returnMsg(res, 
        {
          result: txn.docs,
          totalCount: txn.totalDocs,
        },
        "Transactions retrieved successfully"
      )
  });
};


export const updateTransactionStatus = async (req: any, res: any) => {
  const { staff, admin } = req;
  const { id } = req.params;
  const txn = await Transactions.find({ _id: id });

  if (!txn) {
    throw new NotFoundError("Transaction does not exist");
  }

  const result = await Transactions.findOneAndUpdate(
    { _id: id },
    {
      $set: { status: req.body.status },
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

 returnMsg(res, result, "Transactions status updated successfully");
};

