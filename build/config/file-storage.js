"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeFileUpload = exports.uploadBigKYCDocument = exports.uploadKYCDocument = exports.uploadProfilePic = exports.s3 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});
// bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
const BucketFolder_1 = `${process.env.AWS_S3_BUCKET}/sample/profile-pic`;
const BucketFolder_2 = `${process.env.AWS_S3_BUCKET}/sample/kyc-documents`;
const BucketFolder_3 = `${process.env.AWS_S3_BUCKET}/sample/dispute-pop`;
exports.s3 = new aws.S3();
exports.uploadProfilePic = multer({
    storage: multerS3({
        s3: exports.s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: (_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.AWS_CONTENT_DISPOSITION) !== null && _b !== void 0 ? _b : 'inline',
        // META DATA FOR PUTTING FIELD NAME
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_1,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb("Error: Only jpeg|jpg|png extention type of image are allowed!");
        }
    }
});
exports.uploadKYCDocument = multer({
    storage: multerS3({
        s3: exports.s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: (_d = (_c = process.env) === null || _c === void 0 ? void 0 : _c.AWS_CONTENT_DISPOSITION) !== null && _d !== void 0 ? _d : 'inline',
        // META DATA FOR PUTTING FIELD NAME
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_2,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 50 }, // 5MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb("Error: Allowed images are of extensions jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls !");
        }
    }
});
exports.uploadBigKYCDocument = multer({
    storage: multerS3({
        s3: exports.s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: (_f = (_e = process.env) === null || _e === void 0 ? void 0 : _e.AWS_CONTENT_DISPOSITION) !== null && _f !== void 0 ? _f : 'inline',
        // META DATA FOR PUTTING FIELD NAME
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_2,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 200 }, // 20MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb("Error: Allowed images are of extensions jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls only!");
        }
    }
});
exports.disputeFileUpload = multer({
    storage: multerS3({
        s3: exports.s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: (_h = (_g = process.env) === null || _g === void 0 ? void 0 : _g.AWS_CONTENT_DISPOSITION) !== null && _h !== void 0 ? _h : 'inline',
        // META DATA FOR PUTTING FIELD NAME
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_3,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 50 }, // 5MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb("Error: Allowed images are of extensions jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls !");
        }
    }
});
