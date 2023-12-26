import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Order, Product } from "../model/index.schema";

export const addOrder = async (req: any, res: any) => {
    const data: IOrder = req.body;

    const product: any = await Product.findOne({productId: data.productId});
    if (!product) {
      throw new ConflictError("Product does not exists");
    }

    const order: any = await Order.findOne({productId: data.productId, userId: data.userId});
    if (order) {
      throw new ConflictError("Product order already exists");
    }
  
    const saveOrder: any = await Order.create(data);
    if (!saveOrder) {
      throw new BadRequestError("Something went wrong, could not save Order");
    }
    returnMsg(res, saveOrder, "Product order added successfully");
}

export const updateOrder = async (req: any, res: any) => {

    const { orderId } = req.params;
  if (!orderId) {
    throw new BadRequestError("Product order id not provided");
  }

  const findOrder: any = await Order.findOne({ _id: orderId });
  if (!findOrder) {
    throw new BadRequestError("Product order not found");
  }
  const putOrder = await Order.findByIdAndUpdate(
    { _id: orderId },
    {
      $set: req.body,
    }
  );
  returnMsg(res, putOrder, "Product order updated successfully");

}

export const getManyOrder = async (req: any, res: any) => {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;

    const queries: any[] = [
      "orderId",
      "shippingId",
      "productId",
      "userId",
      "paymentChannel",
      "transactionId",
      "paymentStatus",
      "status",
    ];
    const matchQuery: any = {};
  
      /** search dispute by date created */
  if (fromDate && toDate) {
    matchQuery["createdAt"] = {
      $gte: new Date(`${fromDate}`).toISOString(),
      $lt: new Date(`${toDate}`).toISOString(),
    };
  }

    Object.keys(req.query).forEach((element) => {
      if (element === "orderId") {
        matchQuery["_id"] = req.query[element];
      }
            
      else if (element === "search") {
        matchQuery["$or"] = [
          { name: { $regex: req.query.search, $options: "i" } },
          { desc: { $regex: req.query.search, $options: "i" } },
        ];
      } else {
        if (queries.includes(element)) {
          matchQuery[element] = req.query[element];
        }
      }
    });
  
    Order.paginate(
      matchQuery,
      {
        populate: [{path: 'paymentId'}, {path: "productId"}],
        limit: limit,
        offset: offset,
        sort: {
          createdAt: -1,
          _id: 1,
        },
      },
      (err: any, result: any) => {
        if (!err) {
          returnMsg(
            res,
            {
              result: result.docs,
              totalCount: result.totalDocs,
            },
            "Product order retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneOrder = async (req: any, res: any) => {
    const { orderId } = req.params;
    const findOrder: any = await Order.findOne({ _id: orderId }).populate( [{path: 'paymentId'}, {path: "productId"}]);;
    if (!findOrder) {
      throw new NotFoundError("Product order not found");
    }
  
    returnMsg(res, findOrder, "Product order retrieved successfully");
  };
  
  export const deleteOrder = async (req: any, res: any) => {
    const { orderId } = req.params;
    const findOrder: any = await Order.findOne({ _id: orderId });
    if (!findOrder) {
      throw new NotFoundError("Product order not found");
    }
  
    const del = await Order.findByIdAndDelete({ _id: orderId });
    returnMsg(res, [], "Product order deleted successfully");
  };
  