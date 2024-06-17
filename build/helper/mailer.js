"use strict";
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
async function sendMail(to, subject, html, attachment = null, isAttachment = false) {
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
}
exports.sendMail = sendMail;
async function sendBulkMail(bcc, subject, html) {
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
}
exports.sendBulkMail = sendBulkMail;
