const nodemailer = require("nodemailer");
const fs = require("fs");
const promisify = require('util').promisify;
const dotenv = require("dotenv");
dotenv.config();

const readFileAsync = promisify(fs.readFile);
const filePath = require.resolve('../../static/otp.html');
const getHtmlTemplate = async () => {
    return await readFileAsync(filePath, 'utf-8');
};

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

async function emailSender(to, subject, html, text) {
    try {
        let emailObject = {
            to: to,
            from: process.env.SENDER_EMAIL,
            subject: subject,
            text: text,
            html: html,
        };
        await transporter.sendMail(emailObject);
    } catch (err) {
        throw new Error(err.message);
    }
}


async function sendEmail(otp, userName, to) {
    getHtmlTemplate().then(async (HtmlTemplate) => {
        const nameUpdatedHtml = HtmlTemplate.replace("#{USER_NAME}", userName);
        const finalHTMLCode = nameUpdatedHtml.replace("#{OTP}", otp);
        const text = `
        Hi ${userName}
        Your otp to reset your password is ${otp}`;
        const subject = "RESET PASSWORD Verification OTP";
        await emailSender(to, subject, finalHTMLCode, text);
    }).catch(err => {
        throw new Error(err);
    })
}

module.exports = sendEmail;