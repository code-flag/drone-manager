import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Contact } from "../model/index.schema";

export const addContact = async (req: any, res: any) => {
    const data: any = req.body;
  
    const saveContact: any = await Contact.create(data);
    if (!saveContact) {
      throw new BadRequestError("Something went wrong, could not save Contact");
    }
    returnMsg(res, saveContact, "Contact added successfully");
}

export const getManyContact = async (req: any, res: any) => {
    const { limit = 10, offset = 0, fromDate, toDate} = req.query;

    const queries: any[] = [
      "ticketId",
      "name",
      "email",
      "subject",
      "contactType",
      "isRead",
      "phone",
      "search",
      "contactId"
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
      if (element === "contactId") {
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
  
    Contact.paginate(
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
            "Contact retrieved successfully"
          );
        }
      }
    );
  };
  

  export const getOneContact = async (req: any, res: any) => {
    const { contactId } = req.query;
    const findContact: any = await Contact.findOne({ _id: contactId });
    if (!findContact) {
      throw new NotFoundError("Contact not found");
    }
  
    returnMsg(res, contactId, "Contact retrieved successfully");
  };
  
  export const deleteContact = async (req: any, res: any) => {
    const { contactId } = req.query;
    const findContact: any = await Contact.findOne({ _id: contactId });
    if (!findContact) {
      throw new NotFoundError("Contact not found");
    }
  
    const del = await Contact.findByIdAndDelete({ _id: contactId });
    returnMsg(res, [], "Contact deleted successfully");
  };
  