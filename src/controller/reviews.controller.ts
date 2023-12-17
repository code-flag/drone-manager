import { BadRequestError, ConflictError, NotFoundError } from "helper/error";
import { returnMsg } from "helper/message-handler";
import { Review } from "model/index.schema";

export const addReview = async (req: any, res: any) => {
    const data: IReview = req.body;

    const review: any = await Review.findOne({ productId: data.productId, userId: data.userId });
    if (review) {
      throw new ConflictError("Review already exists");
    }

    if (data.rating > 5) {
        throw new BadRequestError("Rating must be between 5 and 1 stars");
    }
  
    const saveReview: any = await Review.create(data);
    if (!saveReview) {
      throw new BadRequestError("Something went wrong, could not save Review");
    }
    returnMsg(res, saveReview, "Review added successfully");
}

export const updateReview = async (req: any, res: any) => {

    const { reviewId } = req.params;
  if (!reviewId) {
    throw new BadRequestError("Review id not provided");
  }

  const findCat: any = await Review.findOne({ _id: reviewId });
  if (!findCat) {
    throw new BadRequestError("Review not found");
  }
  const putReview = await Review.findByIdAndUpdate(
    { _id: reviewId },
    {
      $set: req.body,
    }
  );
  returnMsg(res, putReview, "Review updated successfully");

}

export const getManyReview = async (req: any, res: any) => {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;

    const queries: any[] = [
      "reviewId",
      "userId",
      "productId",
      "rating",
      "comment",
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
      if (element === "reviewId") {
        matchQuery["_id"] = req.query[element];
      }
            
     else {
        if (queries.includes(element)) {
          matchQuery[element] = req.query[element];
        }
      }
    });
  
    Review.paginate(
      matchQuery,
      {
        populate: ['userId', 'productId'],
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
            "Review retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneReview = async (req: any, res: any) => {
    const { reviewId } = req.query;
    const findReview: any = await Review.findOne({ _id: reviewId }).populate(['userId', 'projectId']);
    if (!findReview) {
      throw new NotFoundError("Review not found");
    }
  
    returnMsg(res, reviewId, "Review retrieved successfully");
  };
  
  export const deleteReview = async (req: any, res: any) => {
    const { reviewId } = req.query;
    const findReview: any = await Review.findOne({ _id: reviewId });
    if (!findReview) {
      throw new NotFoundError("Review not found");
    }
  
    const del = await Review.findByIdAndDelete({ _id: reviewId });
    returnMsg(res, [], "Review deleted successfully");
  };
  