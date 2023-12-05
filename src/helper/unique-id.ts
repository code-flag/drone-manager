import { nanoid } from 'nanoid'
export const getUniqueId = async (len: number = 8) => nanoid(len) //=> "V1StGXR8_Z5jdHi6B-myT"
export const generateDisputeTicketID = async (len: number = 6) => nanoid(len) //=> "V2StGXR8_Z5jdHi6B-&7G"