import { returnMsg } from "../helper/message-handler";
import { Shipping } from "../model/index.schema";

export const addShipping = async (req: any, res: any) => {
    const shipping = await Shipping.findOne({})
    returnMsg(res, [], "addShipping");
}

export const updateShipping = async (req: any, res: any) => {

    returnMsg(res, [], "addShipping");
}

export const getManyShipping = async (req: any, res: any) => {

    returnMsg(res, [], "addShipping");
}

export const getOneShipping = async (req: any, res: any) => {

    returnMsg(res, [], "addShipping");
}

export const deleteShipping = async (req: any, res: any) => {

    returnMsg(res, [], "addShipping");
}