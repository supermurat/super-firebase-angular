import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { sendMail } from './helpers';
import { ContactModel } from './models/contact-model';
import { PrivateConfigModel } from './models/private-config-model';

const db = admin.firestore();

const sendMailForNewMessageEn = async (newMessageData: ContactModel): Promise<any> =>
    db.doc('configs/private_en-US')
        .get()
        .then(async doc => {
            if (doc.exists) {
                const privateConfig = doc.data() as PrivateConfigModel;
                const mailContent = `Hi Admin, <br><br> You have got a message from ${
                    newMessageData.userLongName
                    }.<br><br>Message:<br>${
                    newMessageData.message
                    }<br><br>Did he/she agreed agreement?: ${
                    newMessageData.isAgreed ? 'Yes' : 'No'
                    }`;
                const mailContentForOwner = `Hi ${
                    newMessageData.userLongName
                    }, <br><br> Thank you for your message and valued time.
                                       We will contact with you soon.<br><br>Your Message:<br>${
                    newMessageData.message
                    }<br><br>Have a great day,`;

                return sendMail({
                    to: privateConfig.mail.mailAddressOfAdmin,
                    from: newMessageData.email,
                    subject: `You Have Got a Message - ${privateConfig.mail.siteName}`,
                    html: mailContent
                },              privateConfig)
                    .then(async value => {
                        if (newMessageData.isSendCopyToOwner) {
                            return sendMail({
                                to: newMessageData.email,
                                from: newMessageData.email,
                                subject: `Thank You For Your Message - ${privateConfig.mail.siteName}`,
                                html: mailContentForOwner
                            },              privateConfig);
                        }

                        return Promise.resolve();
                    });
            }

            return Promise.reject('There is no private config!');
        }).catch(error => {
            console.log('Error getting document:', error);
        });

const sendMailForNewMessageTr = async (newMessageData: ContactModel): Promise<any> =>
    db.doc('configs/private_tr-TR')
        .get()
        .then(async doc => {
            if (doc.exists) {
                const privateConfig = doc.data() as PrivateConfigModel;
                const mailContent = `Merhaba Admin, <br><br> ${
                    newMessageData.userLongName
                    } isimli kişiden bir mesaj aldınız.<br><br>Mesaj:<br>${
                    newMessageData.message
                    }<br><br>Anlaşmayı onayladı mı?: ${
                    newMessageData.isAgreed ? 'Evet' : 'Hayır'
                    }`;
                const mailContentForOwner = `Merhaba ${
                    newMessageData.userLongName
                    }, <br><br> Mesajınız ve değerli zamanınız için çok teşekkür ederiz.
                                       Sizinle yakında iletişime geçeceğiz.<br><br>Mesajınız:<br>${
                    newMessageData.message
                    }<br><br>Harika bir gün geçirmenizi dileriz,`;

                return sendMail({
                    to: privateConfig.mail.mailAddressOfAdmin,
                    from: newMessageData.email,
                    subject: `Bir Mesajınız Var - ${privateConfig.mail.siteName}`,
                    html: mailContent
                },              privateConfig)
                    .then(async value => {
                        if (newMessageData.isSendCopyToOwner) {
                            return sendMail({
                                to: newMessageData.email,
                                from: newMessageData.email,
                                subject: `Mesajınız İçin Teşekkür Ederiz - ${privateConfig.mail.siteName}`,
                                html: mailContentForOwner
                            },              privateConfig);
                        }

                        return Promise.resolve();
                    });
            }

            return Promise.reject('There is no private config!');
        }).catch(error => {
        console.log('Error getting document:', error);
    });

export const newMessageEn = functions
    // .region('europe-west1')
    .firestore
    .document('messages_en-US/{messageId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap, context) =>
        sendMailForNewMessageEn(snap.data()));

export const newMessageTr = functions
    // .region('europe-west1')
    .firestore
    .document('messages_tr-TR/{messageId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap, context) =>
        sendMailForNewMessageTr(snap.data()));
