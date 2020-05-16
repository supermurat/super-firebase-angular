import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { sendMail } from './helpers';
import { backupFirestore } from './jobs';
import { ContactModel, PrivateConfigModel } from './models';

/** firestore instance */
const db = admin.firestore();

/** send mail for new message in en-US */
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

                        return Promise.resolve(value);
                    });
            }

            throw new Error('There is no private config!');
        });

/** send mail for new message in tr-TR */
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

                        return Promise.resolve(value);
                    });
            }

            throw new Error('There is no private config!');
        });

/** new message trigger function for en-US */
export const newMessageEn = functions
    // .region('europe-west1')
    .firestore
    .document('messages_en-US/{messageId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap, context) =>
        sendMailForNewMessageEn(snap.data())
            .then(value => {
                console.log(value);

                return value;
            })
            .catch(err => {
                console.error('functions.onCreate', err);

                return err;
            })
    );

/** new message trigger function for tr-TR */
export const newMessageTr = functions
    // .region('europe-west1')
    .firestore
    .document('messages_tr-TR/{messageId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap, context) =>
        sendMailForNewMessageTr(snap.data())
            .then(value => {
                console.log(value);

                return value;
            })
            .catch(err => {
                console.error('functions.onCreate', err);

                return err;
            })
    );

/** automatically backup firestore */
export const autoBackupFirestore = functions.pubsub
    // [Minute (0-59)] [Hour (0-23)] [Day of the month (1-31)] [Month (1-12)] [Day of the week (0-6 Sunday to Saturday)]
    .schedule('0 2 * * 0')
    .timeZone('Europe/Istanbul')
    .onRun(async context => {
        console.log('autoBackupFirestore is started!');

        return backupFirestore({})
            .then(value => {
                console.log('autoBackupFirestore is finished! result:', value);

                return value;
            }).catch(err => {
                console.error('autoBackupFirestore', err);

                return err;
            });
    });
