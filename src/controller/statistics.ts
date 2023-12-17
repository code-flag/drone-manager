
import { returnMsg } from "../helper/message-handler";
import { Transactions, User, Dispute, Order, Product } from "../model/index.schema";
import { getUserAddedPerMonth } from '../helper/library';

export const userAndTransactionRecord = async (req: any, res: any) => {

    const [totalUser, totalActiveUser, totalOrder, totalProduct, totalTransactions, totalActiveDispute] = await Promise.all([
        User.count(),
        User.count({isActive: true}),
        Order.count(),
        Product.count({isApproved: true}),
        Transactions.find(),
        Dispute.count(),
        Dispute.count({status: true})
    ]);
    
   const txn: any = getUserAddedPerMonth(totalTransactions);

   returnMsg(res, {
    totalUser: totalUser,
    totalActiveUser: totalActiveUser, 
    totalOrder: totalOrder, 
    totalProduct: totalProduct, 
    totalTransactions: totalTransactions.length,
    Transactions: txn,
    totalActiveDispute: totalActiveDispute,
}, "data retrieved successfully");
   
}