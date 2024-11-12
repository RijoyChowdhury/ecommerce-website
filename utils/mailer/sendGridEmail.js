const sgMail = require('@sendgrid/mail');
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'test-user@gmail.com',
    from: 'client@gmail.com',
    subject: 'Testing Sendgrid to send Email',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>Testing POC using Sendgrid package</strong>',
}

sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent');
    })
    .catch((error) => {
        console.error(error)
    })