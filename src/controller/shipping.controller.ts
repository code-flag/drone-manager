import { Request, Response } from "express";
import { returnMsg } from "helper/message-handler";
import { Shipping } from "model/index.schema";

export const addShipping = async (req: Request, res: Response) => {
    const shipping = await Shipping.findOne({})
    returnMsg(res, [], "addShipping");
}

export const updateShipping = async (req: Request, res: Response) => {

    returnMsg(res, [], "addShipping");
}

export const getManyShipping = async (req: Request, res: Response) => {

    returnMsg(res, [], "addShipping");
}

export const getOneShipping = async (req: Request, res: Response) => {

    returnMsg(res, [], "addShipping");
}

export const deleteShipping = async (req: Request, res: Response) => {

    returnMsg(res, [], "addShipping");
}