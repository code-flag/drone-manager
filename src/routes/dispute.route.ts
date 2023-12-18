import  Router from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { adminResolution, createDispute, getAllDisputes, getDisputeByTicketId, getDisputeByUserId } from '../controller/dispute.controller';
import { verifyAccessKey, verifyToken } from "../middleware/auth";


const router: any = Router();


router.post(
"/create",
verifyAccessKey,
verifyToken,
asyncWrapper(createDispute));

router.get(
"/all",
verifyAccessKey,
verifyToken,
asyncWrapper(getAllDisputes));


router.get(
"/ticketId/:disputeTicketId",
verifyAccessKey,
verifyToken,
asyncWrapper(getDisputeByTicketId));

router.get(
"/userId/:userId",
verifyAccessKey,
verifyToken,
asyncWrapper(getDisputeByUserId));

router.put(
"/resolve-dispute",
verifyAccessKey,
verifyToken,
asyncWrapper(adminResolution));


export default router;
