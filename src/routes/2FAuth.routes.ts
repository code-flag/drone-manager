import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { validateToken } from "../controller/2FAuth.controller";
import { Activate2Fa } from '../controller/2FAuth.controller';


const router: any = Router();



router.post(
"/generate-secret", 
asyncWrapper(Activate2Fa),
);


router.post(
"/verify2FAToken", 
asyncWrapper(validateToken),
);


export default router;
