import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Category } from "../model/index.schema";

export const addCategory = async (req: any, res: any) => {
    const data: ICategory = req.body;

    const category: any = await Category.findOne({ name: data.name });
    if (category) {
      throw new ConflictError("Category already exists");
    }
  
    const saveCategory: any = await Category.create(data);
    if (!saveCategory) {
      throw new BadRequestError("Something went wrong, could not save Category");
    }
    returnMsg(res, saveCategory, "Category added successfully");
}

export const updateCategory = async (req: any, res: any) => {

    const { categoryId } = req.params;
  if (!categoryId) {
    throw new BadRequestError("Category id not provided");
  }

  const findCat: any = await Category.findOne({ _id: categoryId });
  if (!findCat) {
    throw new BadRequestError("Category not found");
  }
  const putCategory = await Category.findByIdAndUpdate(
    { _id: categoryId },
    {
      $set: req.body,
    }
  );
  returnMsg(res, putCategory, "Category updated successfully");

}

export const getManyCategory = async (req: any, res: any) => {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;

    const queries: any[] = [
      "categoryId",
      "name",
      "parentId",
      "desc",
      "parentName",
      "image",
      "type",
      "search"
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
      if (element === "categoryId") {
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
  
    Category.paginate(
      matchQuery,
      {
        populate: [{path: 'parentId'}],
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
            "Category retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneCategory = async (req: any, res: any) => {
    const { categoryId } = req.query;
    const findCategory: any = await Category.findOne({ _id: categoryId }).populate("parentId");
    if (!findCategory) {
      throw new NotFoundError("Category not found");
    }
  
    returnMsg(res, findCategory, "Category retrieved successfully");
  };

  export const getCategoryByType = async (req: any, res: any) => {
    const { type } = req.query;
    const findCategory: any = await Category.findOne({ type: type }).populate("parentId");
    if (!findCategory) {
      throw new NotFoundError("Category not found");
    }
  
    returnMsg(res, findCategory, "Category retrieved successfully");
  };
  
  export const deleteCategory = async (req: any, res: any) => {
    const { categoryId } = req.query;
    const findCategory: any = await Category.findOne({ _id: categoryId });
    if (!findCategory) {
      throw new NotFoundError("Category not found");
    }
  
    const del = await Category.findByIdAndDelete({ _id: categoryId });
    returnMsg(res, [], "Category deleted successfully");
  };
  