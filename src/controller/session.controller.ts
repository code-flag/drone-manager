import { Session } from "../model/index.schema";
import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";


export const getManySession= async (req: any, res: any) => {
    const { limit = 10, offset = 0, userId, fromDate, toDate } = req.query;

    const matchQuery: any = {userId: userId};
  
      /** search dispute by date created */
  if (fromDate && toDate) {
    matchQuery["createdAt"] = {
      $gte: new Date(`${fromDate}`).toISOString(),
      $lt: new Date(`${toDate}`).toISOString(),
    };
  }
  
    Session.paginate(
      matchQuery,
      {
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
            "User session added retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneSession = async (req: any, res: any) => {
    const { sessionId } = req.query;
    const findSession: any = await Session.findOne({ _id: sessionId }).populate(["sessionId","productId"]);
    if (!findSession) {
      throw new NotFoundError("User session added not found");
    }
  
    returnMsg(res, findSession, "User session added retrieved successfully");
  };
  
  export const deleteCart = async (req: any, res: any) => {
    const { sessionId } = req.query;
    const findSession: any = await Session.findOne({ _id: sessionId });
    if (!findSession) {
      throw new NotFoundError("User session added not found");
    }
  
    const del = await Session.findByIdAndDelete({ _id: sessionId });
    returnMsg(res, [], "User session added deleted successfully");
  };
  