"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullAccessDependantOnboardingMessage = void 0;
const path_1 = require("path");
const resFilename = require('url').pathToFileURL(__filename).toString();
const __dirname = (0, path_1.dirname)(resFilename);
const fullAccessDependantOnboardingMessage = (data) => {
    return { message: `
    <!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Page Title</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script src='main.js'></script>
</head>
<body style="background: #fdfdff">
    <table align="center" border="0" cellpadding="0" cellspacing="0"
        width="100%" bgcolor="#fdfdff" style="border: none; background: #fff; color: #333" >
        <tbody>
            <tr>
                <td align="center" colspan="2">
                    <table align="center" border="0" cellpadding="0"
                        cellspacing="0" class="col" width="inherit">
                        <tbody>
                            <tr>
                                <td align="center" style="background-color: #1890ff;
                                        padding: 8px 20px;">

                                    <a href="www.gate-house.com" style="text-decoration: none; color:white;
                                    font-weight:bold; font-style: 24px">
                                        Gate-house: Resident Onboarding Message
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="left" style="border: none;
                        border-bottom: 1px solid #f0f0ff;
                        padding-right: 20px;padding-left:20px">
                    
                    <div>Hello ${data.fullName}, </div>

                    <p style="font-size: inherit;
                    letter-spacing: inherit; line-height: inherit;
                    color: inherit;">
                    ${data.primaryReisdentName} has created a profile for you as a ${data.role} on the GateHouse Access Control & Management Solution. This software allows you to easily manage access into the estate for your visitors. The overall benefit of this is a major improvement of security within the estate,
                    </p>
                    
                    Your Login Details <hr>
                    Username: ${data.email} <hr>
                    password: ${data.password} <hr>
                    Role: ${data.role} <hr>
                    
                    <ul>
                        <p>As a <strong>full access dependant,</strong>  you can use the app to</p>
                        <li>Conveniently book unlimited number of visitors  </li>
                        <li>Raise gatepasses for deliveries into the your home, or authorisation to take stuff out of your home </li>
                        <li>Requesting for estate services from anywhere (eg plumber, or cleaner) where you are authorised to do so </li>
                        <li>Request for third party services from outside,  </li>
                        <li>Getting notified of your dependant booking, (eg you ward books a friend into the estate) </li>
                        <li>Raising alarm in 1 click (you can send an SOS message in one click to the estate security)  etc </li>
                            
                    </ul>

                    
                </td>
            </tr>
            <tr>
                       <td colspan="2">
                       <h2>Getting started</h2> 
                    <p>download gate house app on  </p>
                                    
                          <a href="https://apps.apple.com/ng/app/gatehouse/id1311305513">  <img style='max-width: 200px; max-height: 50px' src="cid:appstore" alt="appstore-logo"> </a>
                          <a href="www.gate-house.com">  <img style='max-width: 200px; max-height: 50px' src="cid:small-logo" alt="company-logo"> </a>
                          <a href="https://play.google.com/store/apps/details?id=com.gate_house.client_mobile">  <img style='max-width: 200px; max-height: 50px'  src="cid:playstore" alt="playstore-logo"> </a>
                       </td>                                         
            </tr>
            <tr>
                <td style="vertical-align: top"> 
                    
                        <p>Insert your login details listed below </p>

                        <p>
                             Username:  <strong> ${data.email}</strong> <br>
                             password: <strong>${data.password}</strong>  
                         </p>
                                    
                        <p>Click login to go to a landing page similar to this image  </p>
                                
                        <p>Note that you need to change your password after first login </p>
                      
                </td>

                <td style="vertical-align: baseline;
                text-align: left;
                width: 50%;">
                   <img src="cid:mobile-app" alt="app-sample-image">
                </td>
            </tr>

            <tr>
                <td colspan="2" style="height: 150px;
                        padding: 20px;
                        border: none;
                        border-bottom: 1px solid #361B0E;
                        background-color: f9f9f9;">
                    
                    <h2 style="text-align: left;
                            align-items: center;">
                        How to Get Help?
                        
                </h2>
                    <p class="data"
                    style="text-align: justify-all;
                            align-items: center;
                            font-size: 15px;
                            padding-bottom: 12px;">
                    Click on the Help link at the bottom of your home screen to see the help files or watch related videos. <br>
                    Reach us on <strong>WhatsApp or Phone 09085424519</strong>
                    <br>
                    Book an online training session by clicking the link <a href="http://gate-house.com">training session</a> or <a href="tel:+2349085429519">call 09085429519.</a> 
                    </p>
                    <p>
                        <a href=
"https://www.gate-house.com"
                        style="text-decoration: none;
                                color:black;
                                border-radius: 8px;
                                border: 2px solid #1890ff;
                                padding: 10px 30px;
                                font-weight: bold;">
                        Visit Website
                    </a>
                    </p>
                </td>
            </tr>
            <tr style="border: none;
            background-color: #1890ff;
            height: 40px;
            color:white;
            padding-bottom: 20px;
            text-align: center;">
                
<td colspan="2" height="40px" align="center">
    <p style="color:white; line-height: 1.5em; font-style: 24px; font-weight: bold">
    Gate-house
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
<td colspan="2" style="font-family:'Open Sans', Arial, sans-serif;
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
                © 2021 Gate-house. All Rights Reserved.<br>
                If you do not wish to receive any further
                emails from us, please
                <a href="www.gate-house.com"
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
</html>
    `,
        attachment: [
            {
                filename: "logo.png",
                path: __dirname + "/onboarding-template-images/logo.png",
                cid: "logo",
            },
            {
                filename: "small-logo.png",
                path: __dirname + "/onboarding-template-images/small-logo.png",
                cid: "small-logo",
            },
            {
                filename: "playstore.png",
                path: __dirname + "/onboarding-template-images/playstore.png",
                cid: "playstore",
            },
            {
                filename: "appstore.png",
                path: __dirname + "/onboarding-template-images/appstore.png",
                cid: "appstore",
            },
            {
                filename: "mobile-app.jpeg",
                path: __dirname + "/onboarding-template-images/mobile-app.jpeg",
                cid: "mobile-app",
            },
        ]
    };
};
exports.fullAccessDependantOnboardingMessage = fullAccessDependantOnboardingMessage;
