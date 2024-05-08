const nodemailer = require("nodemailer");
const config = require("../config");

module.exports = {
  sendEmail: async (email, subject, text) => {
    const msg = {
      from: "'INCIT' <incit>",
      to: email,
      subject,
      text,
    };
    nodemailer
      .createTransport({
        service: "gmail",
        auth: {
          user: config.mailConfig.email,
          pass: config.mailConfig.pass,
        },
        port: 465,
        host: "smtp.ethereal.email",
      })
      .sendMail(msg, (err) => {
        if (err) throw new Error(err);
      });
  },
  generateRandomString(length) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
};
