import { Request, Response } from "express";
import { returnMsg } from "helper/message-handler";
import { Tracking } from "model/index.schema";

export const addTracking = async (req: Request, res: Response) => {
    const tracking = await Tracking.findOne({})
    returnMsg(res, [], "addTracking");
}

export const updateTracking = async (req: Request, res: Response) => {

    returnMsg(res, [], "addTracking");
}

export const getManyTracking = async (req: Request, res: Response) => {

    returnMsg(res, [], "addTracking");
}

export const getOneTracking = async (req: Request, res: Response) => {

    returnMsg(res, [], "addTracking");
}

export const deleteTracking = async (req: Request, res: Response) => {

    returnMsg(res, [], "addTracking");
}