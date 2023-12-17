"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpConfirmationMsg = void 0;
const path_1 = require("path");
const fs = __importStar(require("fs"));
const resfilename = require('url').pathToFileURL(__filename).toString();
const mydirname = (0, path_1.dirname)(resfilename);
const otpConfirmationMsg = (data) => {
    return { message: `
    <body style="background: #fdfdff">
    <table align="center" border="0" cellpadding="0" cellspacing="0"
        width="100%" bgcolor="#fdfdff" style="border: none">
        <tbody>
            <!-- <tr>
                <td align="center">
                    <table align="center" border="0" cellpadding="0"
                        cellspacing="0" class="col" width="inherit">
                        <tbody>
                            <tr>
                                <td align="center" style="background-color: #154374;
                                        padding: 8px 20px;">

                                    <a href="www.payslate.com.ng" style="text-decoration: none; color:white;
                                    font-weight:bold; font-style: 24px">
                                        Payslate: Confirmation mail
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr> -->
            <tr style="height: 300px;">
                <td align="left" style="border: none;
                        border-bottom: 1px solid #f0f0ff;
                        padding-right: 20px;padding-left:20px">

                        <div> <img src="cid:congratulation" alt="congratulation"> </div>
                        <div style="text-align: center">
                        <b> Thanks for signing up </b>
                        <p> 
                         Welcome to our community ${data.name}. We are delighted to have you with us. 
                         We hope you find in our business what you are looking for. Kindly login to your dashboard to complete your profile setup.
                        </p>
                        <p> We'll keep you posted on the latest product and services </>
                        </div>
            
                </td>
            </tr>

            <tr style="border: none;
            background-color: #154374;
            height: 40px;
            color:white;
            padding-bottom: 20px;
            text-align: center;">
                
<td height="40px" align="center">
    <p style="color:white; line-height: 1.5em; font-style: 24px; font-weight: bold">
    Payslate
    </p>
    <a href="#"
    style="border:none;
        text-decoration: none;
        padding: 5px;">
            
    <img height="30"
    src=
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-twitter_20190610074030.png"
    width="30" />
    </a>
    
    <a href="#"
    style="border:none;
    text-decoration: none;
    padding: 5px;">
    
    <img height="30"
    src=
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-linkedin_20190610074015.png"
width="30" />
    </a>
    
    <a href="#"
    style="border:none;
    text-decoration: none;
    padding: 5px;">
    
    <img height="20"
    src=
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/facebook-letter-logo_20190610100050.png"
        width="24"
        style="position: relative;
            padding-bottom: 5px;" />
    </a>
</td>
</tr>
<tr>
<td style="font-family:'Open Sans', Arial, sans-serif;
        font-size:11px; line-height:18px;
        color:#999999;"
    valign="top"
    align="center">
<a href="#"
target="_blank"
style="color:#999999;
        text-decoration:underline;">PRIVACY STATEMENT</a>
        | <a href="#" target="_blank"
        style="color:#999999; text-decoration:underline;">TERMS OF SERVICE</a>
        | <a href="#"
        target="_blank"
        style="color:#999999; text-decoration:underline;">RETURNS</a><br>
                © 2021 Payslate. All Rights Reserved.<br>
                If you do not wish to receive any further
                emails from us, please
                <a href="www.payslate.com.ng"
                target="_blank"
                style="text-decoration:none;
                        color:#999999;">unsubscribe</a>
            </td>
            </tr>
            </tbody></table></td>
        </tr>
        <tr>
        <td class="em_hide"
        style="line-height:1px;
                min-width:700px;
                background-color:#ffffff;">
            <img alt=""
            src="images/spacer.gif"
            style="max-height:1px;
            min-height:1px;
            display:block;
            width:700px;
            min-width:700px;"
            width="700"
            border="0"
            height="1">
            </td>
        </tr>
        </tbody>
    </table>
</body>
`,
        attachment: [
            {
                filename: "congratulation.png",
                cid: "congratulation",
                content: fs.createReadStream("./onboarding-template-images/congratulation.png")
            }
        ]
    };
};
exports.otpConfirmationMsg = otpConfirmationMsg;
