import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Product } from "../model/index.schema";

export const addProduct = async (req: any, res: any) => {
  const product: IProduct = req.body;

  const findProductByName: any = await Product.findOne({ name: product.name });
  if (findProductByName) {
    throw new ConflictError("Product already exists");
  }

  const saveProduct: any = await Product.create(product);
  if (!saveProduct) {
    throw new BadRequestError("Something went wrong, could not save product");
  }
  returnMsg(res, saveProduct, "Product added successfully");
};

export const updateProduct = async (req: any, res: any) => {
  const { productId } = req.params;
  if (!productId) {
    throw new BadRequestError("Product id not provided");
  }

  const findProduct: any = await Product.findOne({ _id: productId });
  if (!findProduct) {
    throw new BadRequestError("Product not found");
  }
  const putProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    {
      $set: req.body,
    }
  );
  returnMsg(res, putProduct, "Product updated successfully");
};



export const updateProductTags = async (req: any, res: any) => {
  const { productId } = req.params;
  if (!productId) {
    throw new BadRequestError("Product id not provided");
  }

  const findProduct: any = await Product.findOne({ _id: productId });
  if (!findProduct) {
    throw new BadRequestError("Product not found");
  }

  let newTags: string[] = []
  if (Array.isArray(req.body.tags)) {
    const tags: string[] = req.body.tags
    newTags = tags.concat(findProduct.tags);
  }
  const putProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    {
      $addToSet: {tags: newTags},
    }
  );
  returnMsg(res, putProduct, "Product tags updated successfully");
};


export const getManyProduct = async (req: any, res: any) => {
  const { limit = 10, offset = 0, fromDate, toDate } = req.query;

  const queries: any[] = [
    "productId",
    "name",
    "reviews",
    "rating",
    "tags",
    "basePrice",
    "discountPrice",
    "discountPercentage",
    "desc",
    "categoryId",
    "subCategoryId",
    "search",
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
    if (element === "productId") {
      matchQuery["_id"] = req.query[element];
    }
    
    else if (element === "tags") {
      matchQuery["tags"] = {$all : [req.query[element] ]};
    }
    
    else if (element === "search") {
      matchQuery["$or"] = [
        { name: { $regex: req.query.search, $options: "i" } },
        { tags: { $regex: req.query.search, $options: "i" } },
        { desc: { $regex: req.query.search, $options: "i" } },
      ];
    } 
    
    else {
      if (queries.includes(element)) {
        matchQuery[element] = req.query[element];
      }
    }
  });

  Product.paginate(
    matchQuery,
    {
      populate: [],
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
          "Product retrieved successfully"
        );
      }
    }
  );
};

export const getOneProduct = async (req: any, res: any) => {
  const { productId } = req.params;
  const findProduct: any = await Product.findOne({ _id: productId });
  if (!findProduct) {
    throw new NotFoundError("Product not found");
  }

  returnMsg(res, findProduct, "Product retrieved successfully");
};

export const deleteProduct = async (req: any, res: any) => {
  const { productId } = req.params;
  const findProduct: any = await Product.findOne({ _id: productId });
  if (!findProduct) {
    throw new NotFoundError("Product not found");
  }

  const del = await Product.findByIdAndDelete({ _id: productId });
  returnMsg(res, [], "Product deleted successfully");
};
