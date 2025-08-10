require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import ErrorHandler from "./Errorhandler";
import { NextFunction } from "express";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, subject, template, data } = options;

  //email template path
  const templatePath = path.join(__dirname, "../mails", template);

  //render email template
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      new ErrorHandler(error, 500);
    }
  });
};

export default sendMail;
