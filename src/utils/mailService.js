import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const userEmail = process.env.GMAIL_USER;
const userPassword = process.env.GMAIL_PASS;
// console
// console.log(`userEmail`, userEmail);
// console.log(`userPassword`, userPassword);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userEmail,
        pass: userPassword,
    },
});

export async function sendEmail({ to, subject, text, html }) {
    return transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
        html,
    });
}
