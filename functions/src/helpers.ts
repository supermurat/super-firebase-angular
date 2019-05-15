import * as nodemailer from 'nodemailer';

import { MailModel } from './models/mail-model';
import { PrivateConfigModel } from './models/private-config-model';

const getHTMLTemplate = (mailContent: string, privateConfig: PrivateConfigModel): string => {
    let body = `
<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'></head><body>
<center style='margin: 0;'>
    <table width='570' style='min-width: 570px;
    border-spacing: 0 !important; margin: 0 auto; border: 5px solid #edf0f4;'>
    <tbody width='570' style='min-width: 570px; margin: 0;'>
    <tr width='570' style='min-width: 570px; margin: 0;'>
    <td width='570' style='min-width: 570px; margin: 0; padding: 0;'>

    <div id='wrapper' style='width: 570px; overflow: auto; padding-top: 0px; margin: 0 auto;'>

    <div id='header' style='margin: 0;'>
        <table width='570px' style='border-spacing: 0 !important; margin: 0;'>
        <tbody><tr style='margin: 0; background-color: %headerBackgroundColor%;'>
        <td style='margin: 0; padding: 0;'>
        <br style='margin: 0;'>
        <br style='margin: 0;'>

        <center style='margin: 0;'>
        <a href='%siteURL%' target='_blank' style='text-decoration: none; color: #8b9198; margin: 0;'>
        %logoOrName%
        </a>
        </center>

        <br style='margin: 0;'>
        </td>
        </tr>

        <tr style='margin: 0;'>
        <td style='margin: 0; padding: 0;'>
        <center style='margin: 0;'>
            <table style='width: 525px; height: 80px; border-top-width: 1px;
            border-top-color: #cdd4de; border-top-style: solid; border-bottom-width: 1px;
            border-bottom-color: #cdd4de; border-bottom-style: solid; border-spacing: 0 !important; margin: 0;'>
            <tbody><tr style='margin: 0;'>
            <td style='text-align: left; margin: 0; padding: 30px 0px 20px 0px;' align='center'>

            %mailContent%

            </td>
            </tr>
            </tbody></table>
        </center>
        </td>
        </tr>

        <tr style='margin: 0; background-color: %headerBackgroundColor%;'>
        <td style='text-align: center; margin: 0; padding: 30px 20px 20px 20px; color: #FFF;' align='center'>
            %automaticallyGeneratedEmailNote%
        <br style='margin: 0;'>
        <br style='margin: 0;'>
         <a href='%siteURL%' target='_blank' style='text-decoration: none; color: #FFF; margin: 0;'>
          © %currentYear% %siteName%
         </a>
        <br style='margin: 0;'>
        <br style='margin: 0;'>

        <a href='%siteURL%' target='_blank' style='text-decoration: none; color: #FFF; margin: 0;'>%siteName%</a>

        </td>
        </tr>
        </tbody></table>
    </div>
    </div>
    </td>
    </tr>
    </tbody>
    </table>
</center>
</body></html>`;
    body = body.replace(/%siteURL%/g, privateConfig.mail.siteURL)
        .replace(/%logoOrName%/g, privateConfig.mail.logoURL ?
                `<img src='${privateConfig.mail.logoURL}' alt='${privateConfig.mail.siteName}' style='margin: 0;'>` :
            privateConfig.mail.siteName)
        .replace(/%siteName%/g, privateConfig.mail.siteName)
        .replace(/%headerBackgroundColor%/g, privateConfig.mail.headerBackgroundColor || '#222')
        .replace(/%headerBackgroundColor%/g, privateConfig.mail.footerBackgroundColor || '#AAA')
        .replace(/%mailContent%/g, mailContent)
        .replace(/%automaticallyGeneratedEmailNote%/g, privateConfig.mail.automaticallyGeneratedEmailNote || '&nbsp;')
        .replace(/%currentYear%/g, new Date().getUTCFullYear().toString());

    return body;
};

export const sendMail = async (mailContent: MailModel, privateConfig: PrivateConfigModel): Promise<any> =>
    new Promise<any>(async (resolve, reject): Promise<any> => {
        // create reusable transporter object using the default SMTP transport
        if (privateConfig.smtp === undefined || privateConfig.mail === undefined || !privateConfig.mail.isSendMail) {
            console.log('Mail send skipped: %s', mailContent.subject);

            resolve();
        } else {
            const smtpConfig = JSON.parse(JSON.stringify(privateConfig.smtp));
            const transporter = nodemailer.createTransport(smtpConfig);
            // setup email data with unicode symbols
            // send mail with defined transport object
            if (!mailContent.from) {
                mailContent.from = privateConfig.mail.mailFrom;
            }
            if (privateConfig.mail.mailToForced) {
                mailContent.to = privateConfig.mail.mailToForced;
            }
            mailContent.html = getHTMLTemplate(mailContent.html ? mailContent.html : mailContent.text, privateConfig);

            const info = await transporter.sendMail(mailContent);
            console.log('Mail send "%s", result: %s', mailContent.subject, JSON.stringify(info));
            if (info.err) {
                reject(info.err);
            } else if (info.response) {
                resolve(info.response);
            } else {
                resolve(info.info);
            }
        }
    });
