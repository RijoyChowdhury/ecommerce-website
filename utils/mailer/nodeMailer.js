const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// creating transporter
const techDetails = {
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
}

const transporter = nodemailer.createTransport(techDetails);

const emailObject = {
    to: 'test-user@gmail.com',
    from: 'client@gmail.com',
    subject: 'Testing Nodemailer to send Email',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>Testing POC using Nodemailer package</strong>',
}

transporter
    .sendMail(emailObject)
    .then(() => {
        console.log("Email is sent.")
    })
    .catch(err => { console.log(err) });