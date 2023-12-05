
export const visitorOnboardingMessage = (data: any) => {
    return  `
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
                                <td align="center" style="background-color: #1890ff;
                                        padding: 8px 20px;">

                                    <a href="www.gate-house.com" style="text-decoration: none; color:white;
                                    font-weight:bold; font-style: 24px">
                                        Gate-house: Staff Onboarding message
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
                    <div>Hi ${data.visitorName}, </div>

                    <p style="font-size: inherit;
                    letter-spacing: inherit; line-height: inherit;
                    color: inherit;">
                    ${data.residentName} has booked you into ${data.estateName}. 
                </p>

                <p>Your booking details are as follows: </p> <hr>
                Date: ${data.arrivalDate} <hr>
                Arrival Time: ${data.arrivalTime} <hr>
                Booking Code: <strong> ${data.bookingCode} </strong> <hr>
                <p>Please come along with the QR image below or copy out the booking code for verification at the gate 
                </p>
                <img src="${data.qrCode}" alt="Booking Code" width="150" height="150">
                </td>
            </tr>

            <tr style="display: inline-block;">
                <td style="height: 150px;
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
                    <strong>Reach us on WhatsApp or Phone <a href="tel:+2349085424519">09085424519</a></strong>
                   
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
                
<td height="40px" align="center">
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
`}