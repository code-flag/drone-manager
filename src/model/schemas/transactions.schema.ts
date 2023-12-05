"use strict";

import mongoose, { PaginateModel, Types } from "mongoose";
// import mongoosePaginate = require('mongoose-paginate-v2');
import paginate from "mongoose-paginate-v2";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { ITransaction, IUpdatedBy } from './types/schema.types';

config();

const {  Schema } = mongoose;

  const UpdatedBy = new Schema<IUpdatedBy> ({
    staffId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Staff",
    },
    actionLevel: {type: Number},
    desc: {type: String}
  })

  interface IPaymentPurpose {
    id: string;
    amount: number;
    quantity: number;
  }

  const Purpose = new Schema<IPaymentPurpose>({
    id: {type: String},
    amount: {type: Number},
    quantity: {type: Number}
  })

const TransactionsSchema = new Schema<ITransaction>(
  {
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    organizationCategory: {type: String, required: true},
    regNo: {type: String},
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
      fullName: {type: String},
      status: {
        type: String,
        required: true,
        enum: ["pending", "declined", "in-progress", "completed"],
        default: "pending",
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      naration: {
        type: String,
        default: null,
      },
      purpose: [Purpose],
      reference: {
        type: String,
      },
          
    updatedBy: [UpdatedBy]
  },
  {
    timestamps: true,
  }
)



TransactionsSchema.set("toJSON",
  { virtuals: true },
  {
    transform: function (doc: any, ret: any, options: any) {
      delete ret.key;
      delete ret.isDeleted;
      delete ret.__v;
    },
  }
);

TransactionsSchema.plugin(paginate);

interface TransactionDocument extends mongoose.Document, ITransaction {}

const Transactions = mongoose.model<
  TransactionDocument,
  mongoose.PaginateModel<TransactionDocument>
>("Transactions", TransactionsSchema, "Transactions");

export default Transactions;
