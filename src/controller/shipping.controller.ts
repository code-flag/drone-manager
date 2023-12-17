import { Shipping } from "../model/index.schema";
import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";

export const addShipping = async (req: any, res: any) => {
    const data: IShipping = req.body;

    const saveToShipping: any = await Shipping.create(data);
    if (!saveToShipping) {
      throw new BadRequestError("Something went wrong, could not save Shipping");
    }
    returnMsg(res, saveToShipping, "shipping info added successfully");
}

export const getManyShipping = async (req: any, res: any) => {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;

    const queries: any[] = [
      "shippingId",
      "userId",
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
            if (queries.includes(element)) {
          matchQuery[element] = req.query[element];
      }
    });
  
    Shipping.paginate(
      matchQuery,
      {
        populate: ["userId"],
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
            "Shipping retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneShipping = async (req: any, res: any) => {
    const { shippingId } = req.query;
    const findShipping: any = await Shipping.findOne({ _id: shippingId }).populate(["userId","shippingId"]);
    if (!findShipping) {
      throw new NotFoundError("Shipping not found");
    }
  
    returnMsg(res, findShipping, "Shipping retrieved successfully");
  };
  
  export const deleteShipping = async (req: any, res: any) => {
    const { shippingId } = req.query;
    const findShipping: any = await Shipping.findOne({ _id: shippingId });
    if (!findShipping) {
      throw new NotFoundError("Shipping not found");
    }
  
    const del = await Shipping.findByIdAndDelete({ _id: shippingId });
    returnMsg(res, [], "Shipping deleted successfully");
  };
  