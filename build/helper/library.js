"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strReplaceAll = exports.asyncUploadUserData = exports.getUserAddedPerMonth = exports.camelCaseToSeparateWords = exports.isObjectKey = void 0;
const message_handler_1 = require("./message-handler");
const unique_id_1 = require("./unique-id");
/**
 * This method checks wether a key exist in an object or not
 * @param {*} obj
 * @param {*} key
 * @returns {boolean} boolean
 */
const isObjectKey = (obj, key) => {
    if (typeof obj == "object") {
        // check for payee key
        if (Object.keys(obj).includes(key)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        console.log("Argument is not a valid object or object of objects", obj, "search key", key);
        return false;
    }
};
exports.isObjectKey = isObjectKey;
/**
 * This function helps in converting camel case to spaced words
 * @param {string} str - the string value in camel case to be converted to spaced words
 * @returns {string} - the formatted spaced words value
 */
const camelCaseToSeparateWords = (str) => {
    return str
        .split("")
        .map((letter, idx) => {
        return letter.toUpperCase() === letter
            ? `${idx !== 0 ? " " : ""}${letter === null || letter === void 0 ? void 0 : letter.toLowerCase()}`
            : letter;
    })
        .join("");
};
exports.camelCaseToSeparateWords = camelCaseToSeparateWords;
const getUserAddedPerMonth = (userDocs) => {
    let dataPerYear = {};
    let months = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
    };
    let prevYear = 0;
    let prevMonth = 0;
    let counter = 0;
    userDocs.forEach((data) => {
        // convert document Iso date to normal date
        let date = new Date(data.createdAt);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();
        // change the month value to two digit string value
        if (dt < 10) {
            dt = "0" + dt;
        }
        if (month < 10) {
            month = "0" + month;
        }
        // initiate the year data if its not yet captured
        if (prevYear !== year) {
            counter = 1;
            dataPerYear[year] = { [months[month]]: counter };
            // update the previous variable values
            prevMonth = month;
            prevYear = year;
            counter++;
        }
        else {
            if (prevMonth !== month) {
                counter = 1;
                dataPerYear[year][months[month]] = counter;
                counter++;
            }
            else {
                dataPerYear[year][months[month]] = counter++;
            }
            // update the previous variable values
            prevYear = year;
            prevMonth = month;
        }
    });
    return dataPerYear;
};
exports.getUserAddedPerMonth = getUserAddedPerMonth;
const asyncUploadUserData = async (inputData, response, callback) => {
    let total = inputData.length;
    let successCount = 0;
    let date = new Date();
    let year = date.getFullYear();
    let result = inputData === null || inputData === void 0 ? void 0 : inputData.map(async (obj) => {
        obj["newRegNo"] = false;
        if (!Object.keys(obj).includes("regNo")) {
            obj["regNo"] = year + "/" + (await (0, unique_id_1.getUniqueId)(8));
            obj["newRegNo"] = true;
        }
        const res = await callback(obj);
        successCount = successCount + res.result;
        return res;
    });
    Promise.all(result).then((x) => {
        (0, message_handler_1.returnMsg)(response, {
            totalRecord: total,
            completed: successCount,
            failed: x[x.length - 1].alreadyExisting.length,
            failedData: x[x.length - 1].alreadyExisting,
        }, successCount == 0
            ? `Unable to upload record, record already exist`
            : `${successCount} user record added successfully`);
    });
};
exports.asyncUploadUserData = asyncUploadUserData;
/** this line is added resolve issue due to the query always replace + character with empty space */
const strReplaceAll = (str, key) => {
    let newString = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] == " ") {
            newString = newString + key;
        }
        else {
            newString = newString + str[i];
        }
    }
    return newString;
};
exports.strReplaceAll = strReplaceAll;
