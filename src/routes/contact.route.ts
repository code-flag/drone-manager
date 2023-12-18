import { Router } from "express";
import { typePermit, verifyAccessKey, verifyToken } from "../middleware/auth";
import asyncWrapper from "../middleware/asyncWrapper";
import { addContact, deleteContact, getContactByEmail, getContactByTicketId, getManyContact, getOneContact } from "controller/contact.controller";

const router: any = Router();

router.post(
  "/create",
  asyncWrapper(addContact)
);

router.get(
    "/all",
    asyncWrapper(getOneContact)
  );

  router.get(
    "/:contactId",
    asyncWrapper(getManyContact)
  );
  router.get(
    "/ticketId/:ticketId",
    asyncWrapper(getContactByTicketId)
  );
  
  router.get(
    "/email/:email",
    asyncWrapper(getContactByEmail)
  );

router.delete("/delete/:contactId", asyncWrapper(deleteContact));

export default router;

