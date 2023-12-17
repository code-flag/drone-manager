"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeConfirmationMsg = void 0;
const path_1 = require("path");
const resFilename = require("url").pathToFileURL(__filename).toString();
const mydirname = (0, path_1.dirname)(resFilename);
const disputeConfirmationMsg = (data) => {
    return {
        message: `           

        <div>Dear ${data.name}, </div>

        <p style="font-size: inherit;
        letter-spacing: inherit; line-height: inherit;
        color: inherit;">
        We have received your dispute query, and our support team will begin processing your request. Your dispute ticketID is <b> ${data.disputeTicketId} </b>. Please use this code to track your complain.
        </p>
        
        <p>Note: Our support may also request this code in the course of processing this Query </p>
       
        <p>If you have any questions or concerns, please don't hesitate to contact us. </p>

        Best regards, <br>
        Payslate
        
     <img src="cid:payslate-logo.png" alt="payslate-logo">

`,
        //         message: `
        //     <body style="background: #fdfdff">
        //     <table align="center" border="0" cellpadding="0" cellspacing="0"
        //         width="100%" bgcolor="#fdfdff" style="border: none">
        //         <tbody>
        //             <!-- <tr>
        //                 <td align="center">
        //                     <table align="center" border="0" cellpadding="0"
        //                         cellspacing="0" class="col" width="inherit">
        //                         <tbody>
        //                             <tr>
        //                                 <td align="center" style="background-color: #154374;
        //                                         padding: 8px 20px;">
        //                                     <a href="www.payslate.com" style="text-decoration: none; color:white;
        //                                     font-weight:bold; font-style: 24px">
        //                                         payslate: Confrimation mail
        //                                     </a>
        //                                 </td>
        //                             </tr>
        //                         </tbody>
        //                     </table>
        //                 </td>
        //             </tr> -->
        //             <tr style="height: 300px;">
        //                 <td align="left" style="border: none;
        //                         border-bottom: 1px solid #f0f0ff;
        //                         padding-right: 20px;padding-left:20px">
        //                     <div>Dear ${data.firstName}, </div>
        //                     <p style="font-size: inherit;
        //                     letter-spacing: inherit; line-height: inherit;
        //                     color: inherit;">
        //                     Thank you for choosing our service. Your OTP is <b> ${data.otp} </b>. Please use this code to complete your registration.
        //                     </p>
        //                     <p>Note: This OTP only valid for 15mins </p>
        //                     <p>If you have any questions or concerns, please don't hesitate to contact us. </p>
        //                     Best regards, <br>
        //                     Payslate
        //                  <img src="cid:payslate-logo.png" alt="payslate-logo">
        //                 </td>
        //             </tr>
        //             <tr style="border: none;
        //             background-color: #154374;
        //             height: 40px;
        //             color:white;
        //             padding-bottom: 20px;
        //             text-align: center;">
        // <td height="40px" align="center">
        //     <p style="color:white; line-height: 1.5em; font-style: 24px; font-weight: bold">
        //     payslate
        //     </p>
        //     <a href="#"
        //     style="border:none;
        //         text-decoration: none;
        //         padding: 5px;">
        //     <img height="30"
        //     src=
        // "https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-twitter_20190610074030.png"
        //     width="30" />
        //     </a>
        //     <a href="#"
        //     style="border:none;
        //     text-decoration: none;
        //     padding: 5px;">
        //     <img height="30"
        //     src=
        // "https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-linkedin_20190610074015.png"
        // width="30" />
        //     </a>
        //     <a href="#"
        //     style="border:none;
        //     text-decoration: none;
        //     padding: 5px;">
        //     <img height="20"
        //     src=
        // "https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/facebook-letter-logo_20190610100050.png"
        //         width="24"
        //         style="position: relative;
        //             padding-bottom: 5px;" />
        //     </a>
        // </td>
        // </tr>
        // <tr>
        // <td style="font-family:'Open Sans', Arial, sans-serif;
        //         font-size:11px; line-height:18px;
        //         color:#999999;"
        //     valign="top"
        //     align="center">
        // <a href="#"
        // target="_blank"
        // style="color:#999999;
        //         text-decoration:underline;">PRIVACY STATEMENT</a>
        //         | <a href="#" target="_blank"
        //         style="color:#999999; text-decoration:underline;">TERMS OF SERVICE</a>
        //         | <a href="#"
        //         target="_blank"
        //         style="color:#999999; text-decoration:underline;">RETURNS</a><br>
        //                 © 2021 payslate. All Rights Reserved.<br>
        //                 If you do not wish to receive any further
        //                 emails from us, please
        //                 <a href="www.payslate.com"
        //                 target="_blank"
        //                 style="text-decoration:none;
        //                         color:#999999;">unsubscribe</a>
        //             </td>
        //             </tr>
        //             </tbody></table></td>
        //         </tr>
        //         <tr>
        //         <td class="em_hide"
        //         style="line-height:1px;
        //                 min-width:700px;
        //                 background-color:#ffffff;">
        //             <img alt=""
        //             src="images/spacer.gif"
        //             style="max-height:1px;
        //             min-height:1px;
        //             display:block;
        //             width:700px;
        //             min-width:700px;"
        //             width="700"
        //             border="0"
        //             height="1">
        //             </td>
        //         </tr>
        //         </tbody>
        //     </table>
        // </body>
        // `,
        attachment: [
            {
                filename: "payslate-logo.png",
                path: mydirname + "/onboarding-template-images/payslate-logo.png",
                cid: "payslate-logo.png",
            },
        ],
    };
};
exports.disputeConfirmationMsg = disputeConfirmationMsg;
