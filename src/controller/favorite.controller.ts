import { Request, Response } from "express";
import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Favorite } from "../model/index.schema";

export const addFavorite = async (req: any, res: any) => {
    const data: IFavorite = req.body;

    const favorite: any = await Favorite.findOne({ productId: data.productId, userId: data.userId});
    if (favorite) {
      throw new ConflictError("Product already added");
    }
  
    const saveToFavorite: any = await Favorite.create(data);
    if (!saveToFavorite) {
      throw new BadRequestError("Something went wrong, could not save Favorite product");
    }
    returnMsg(res, saveToFavorite, "Product added successfully");
}

export const getUserFavoriteProductsPaginated = async (req: any, res: any) => {
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
  
    Favorite.paginate(
      matchQuery,
      {
        populate: ["productId"],
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
            "Favorite product retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getUserFavoriteProduct = async (req: any, res: any) => {
    const { userId } = req.query;
    const findFav: any = await Favorite.findOne({ userId: userId }).populate(["userId","productId"]);
    if (!findFav) {
      throw new NotFoundError("Favorite product not found");
    }
  
    returnMsg(res, findFav, "Favorite product retrieved successfully");
  };
  
  export const deleteFavorite = async (req: any, res: any) => {
    const { favoriteId } = req.query;
    const findFav: any = await Favorite.findOne({ _id: favoriteId });
    if (!findFav) {
      throw new NotFoundError("Favorite product not found");
    }
  
    const del = await Favorite.findByIdAndDelete({ _id: favoriteId });
    returnMsg(res, [], "Favorite product deleted successfully");
  };
  