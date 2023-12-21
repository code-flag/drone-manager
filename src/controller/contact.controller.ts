import { BadRequestError, ConflictError, NotFoundError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { Contact } from "../model/index.schema";
import { getUniqueId } from "../helper/unique-id";

export const addContact = async (req: any, res: any) => {
  const ticketId = await getUniqueId();
  req.body.ticketId = ticketId
    const data: IContact = req.body;

    const isExist = await Contact.findOne({
      ticketId
    })
  
    if (isExist) {
      throw new ConflictError("Ticket already exist");
    }
  
  
    const saveContact: any = await Contact.create(data);
    if (!saveContact) {
      throw new BadRequestError("Something went wrong, could not save Contact");
    }
      // send response email to user
  try {
    // const msgData: any = contactUsResponseMsg ({
    //   name: contactData.name,
    // });
   
    // const emailSubject = "Thank you for contacting us";
    // await sendMail(
    //   contactData.email,
    //   emailSubject,
    //   msgData.message,
    //   msgData.attachment
    // );
  
  } catch (error) {
    console.log(error)
  }

    returnMsg(res, saveContact, "Message sent successfully, one of our representatives will contact you shortly!!");
}


export const getContactByEmail = async (req: any, res: any) => {
const { email } = req.params;
const contact = await Contact.find({ email: email });

if (!contact) {
  throw new BadRequestError("Contact not found");
}
returnMsg(res, contact, "Contact retrieved successfully");
};

// get by ticket ID
export const getContactByTicketId = async (req: any, res: any) => {
const { ticketId } = req.params;
const contact = await Contact.findOne({ ticketId });

if (!contact) {
  throw new BadRequestError("Contact not found");
}
returnMsg(res, contact, "Contact retrieved successfully");
};


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
    const { contactId } = req.params;
    const findContact: any = await Contact.findOne({ _id: contactId });
    if (!findContact) {
      throw new NotFoundError("Contact not found");
    }
  
    returnMsg(res, findContact, "Contact retrieved successfully");
  };
  
  export const deleteContact = async (req: any, res: any) => {
    const { contactId } = req.params;
    const findContact: any = await Contact.findOne({ _id: contactId });
    if (!findContact) {
      throw new NotFoundError("Contact not found");
    }
  
    const del = await Contact.findByIdAndDelete({ _id: contactId });
    returnMsg(res, [], "Contact deleted successfully");
  };
  