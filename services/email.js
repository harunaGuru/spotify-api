const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const sendEmail = async (email, subject, text) => {
   try {
        const transporter = nodemailer.createTransport({
          host: "smtp-relay.sendinblue.com",
          port: 465,
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.USER_EMAIL,
          to: email,
          subject: subject,
          text: text,
        });
        console.log('Email Sent successfully')
    } catch (error) {
        console.log(error, 'Email not sent')
    }
};

module.exports = sendEmail;
