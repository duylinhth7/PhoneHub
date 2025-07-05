import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const sendMail = (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Gmail của Linh
      pass: process.env.EMAIL_PASSWORD, // Dán App Password vào đây
    },
    tls: {
      rejectUnauthorized: false, // ✅ Cho phép chứng chỉ tự ký
    },
  });
  interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
  }
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Đổi thành email người nhận
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (err: Error, info: any) => {
    if (err) {
      console.error("Lỗi gửi email:", err);
    } else {
      console.log("Email đã gửi:", info.response);
    }
  });
};
export default sendMail;
