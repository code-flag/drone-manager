import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Product, Review } from "../model/index.schema";

export const addReview = async (req: any, res: any) => {
    const data: IReviews = req.body;

    const product: any = await Product.findOne({ _id: data.productId});
    if (product) {
      throw new ConflictError("Product does not exists");
    }

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


    const [star1, star2, star3, star4, star5] = await Promise.all([
      Review.count({rating: 1}),
      Review.count({rating: 2}),
      Review.count({rating: 3}),
      Review.count({rating: 4}),
      Review.count({rating: 5}),
  ]);
  
  const revw = star1 + star2 + star3 + star4 + star5
  const rating = ((1 * star1) + (2 * star2) + (3 * star3) + (4 * star4) + (5 * star5) ) / revw

 try {
  await Product.findOneAndUpdate({_id: data.productId }, {
    $set: {ratings: rating, reviews: revw}
  }, {new: true});

 } catch (error: any) {
    console.log("rating error", error?.message);
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
  
    returnMsg(res, findReview, "Review retrieved successfully");
  };

  export const getProductReview = async (req: any, res: any) => {
    const { productId } = req.query;
    const findReview: any = await Review.findOne({ productId: productId }).populate(['userId', 'projectId']);
    if (!findReview) {
      throw new NotFoundError("Review not found");
    }
  
    returnMsg(res, findReview, "Review retrieved successfully");
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
  