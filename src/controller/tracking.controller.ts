import { returnMsg } from "../helper/message-handler";
import { Tracking } from "../model/index.schema";

export const addTracking = async (req: any, res: any) => {
    const tracking = await Tracking.findOne({})
    returnMsg(res, [], "addTracking");
}

export const updateTracking = async (req: any, res: any) => {

    returnMsg(res, [], "addTracking");
}

export const getManyTracking = async (req: any, res: any) => {

    returnMsg(res, [], "addTracking");
}

export const getOneTracking = async (req: any, res: any) => {

    returnMsg(res, [], "addTracking");
}

export const deleteTracking = async (req: any, res: any) => {

    returnMsg(res, [], "addTracking");
}