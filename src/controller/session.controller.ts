import { Request, Response } from "express";
import { returnMsg } from "helper/message-handler";
import { Session } from "model/index.schema";
import { Request, Response } from "express";
import { BadRequestError, ConflictError, NotFoundError } from "helper/error";
import { returnMsg } from "helper/message-handler";
import { Cart } from "model/index.schema";

export const addCart = async (req: any, res: any) => {
    const data: ICart = req.body;

    const cart: any = await Cart.findOne({ name: data.productId});
    if (cart) {
      throw new ConflictError("Product already added");
    }
  
    const saveToCart: any = await Cart.create(data);
    if (!saveToCart) {
      throw new BadRequestError("Something went wrong, could not save Cart product");
    }
    returnMsg(res, saveToCart, "Product added successfully");
}

export const getManyCart = async (req: any, res: any) => {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;

    const queries: any[] = [
      "productId",
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
  
    Cart.paginate(
      matchQuery,
      {
        populate: ["userId", "productId"],
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
            "Cart product retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneCart = async (req: any, res: any) => {
    const { cartId } = req.query;
    const findCart: any = await Cart.findOne({ _id: cartId }).populate(["userId","productId"]);
    if (!findCart) {
      throw new NotFoundError("Cart product not found");
    }
  
    returnMsg(res, cartId, "Cart product retrieved successfully");
  };
  
  export const deleteCart = async (req: any, res: any) => {
    const { cartId } = req.query;
    const findCart: any = await Cart.findOne({ _id: cartId });
    if (!findCart) {
      throw new NotFoundError("Cart product not found");
    }
  
    const del = await Cart.findByIdAndDelete({ _id: cartId });
    returnMsg(res, [], "Cart product deleted successfully");
  };
  