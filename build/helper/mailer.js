"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBulkMail = exports.sendMail = void 0;
const dotenv_1 = require("dotenv");
const nodemailer_1 = require("nodemailer");
const debug_1 = __importDefault(require("debug"));
(0, dotenv_1.config)();
const DEBUG = (0, debug_1.default)("dev");
const transporter = (0, nodemailer_1.createTransport)({
    port: Number(process.env.EMAIL_PORT),
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    secure: true,
    tls: { rejectUnauthorized: false },
});
function sendMail(to, subject, html, attachment = null, isAttachment = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailInfo = {
            from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            attachDataUrls: true,
            html: html,
            attachments: isAttachment ? attachment : [],
        };
        transporter.sendMail(mailInfo, (error, info) => {
            if (error) {
                console.log("error ", error);
                DEBUG(error);
            }
            return true;
        });
    });
}
exports.sendMail = sendMail;
function sendBulkMail(bcc, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailInfo = {
            from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            bcc: bcc,
            subject: subject,
            html: html,
        };
        transporter.sendMail(mailInfo, (error, info) => {
            if (error) {
                DEBUG(error);
            }
            return true;
        });
    });
}
exports.sendBulkMail = sendBulkMail;
