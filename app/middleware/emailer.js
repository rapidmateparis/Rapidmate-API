const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const i18n = require("i18n");
const User = require("../models/user");
const { itemAlreadyExists } = require("../middleware/utils");

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data, callback) => {
  const auth = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // Convert string to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
  const transporter = nodemailer.createTransport(auth);
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage,
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      return callback(false);
    }
    return callback(true);
  });
};

/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = (user, subject, htmlMessage) => {
  user = {
    name: user.name,
    email: user.email,
    verification: user.verification,
  };
  const data = {
    user,
    subject,
    htmlMessage,
  };
  if (process.env.NODE_ENV === "production") {
    sendEmail(
      data,
      (messageSent) => messageSent
      // ? console.log(`Email SENT to: ${user.email}`)
      // : console.log(`Email FAILED to: ${user.email}`)
    );
  } else if (process.env.NODE_ENV === "development") {
    sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`)
    );
  }
};

module.exports = {
  /**
   * Checks User model if user with an specific email exists
   * @param {string} email - user email
   */
  async emailExists(email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },

  /**
   * Checks User model if user with an specific email exists but excluding user id
   * @param {string} id - user id
   * @param {string} email - user email
   */
  async emailExistsExcludingMyself(id, email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
          _id: {
            $ne: id,
          },
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },

  /**
   * Sends registration email
   * @param {string} locale - locale
   * @param {Object} user - user object
   */
  async sendRegistrationEmailMessage(locale, user) {
    i18n.setLocale(locale);
    const subject = i18n.__("registration.SUBJECT");
    const htmlMessage = i18n.__(
      "registration.MESSAGE",
      user.name,
      process.env.FRONTEND_URL,
      user.verification
    );
    prepareToSendEmail(user, subject, htmlMessage);
  },

  /**
   * Sends reset password email
   * @param {string} locale - locale
   * @param {Object} user - user object
   */
  async sendResetPasswordEmailMessage(locale, user) {
    i18n.setLocale(locale);
    const subject = i18n.__("forgotPassword.SUBJECT");
    const htmlMessage = i18n.__(
      "forgotPassword.MESSAGE",
      user.email,
      process.env.FRONTEND_URL,
      user.verification
    );
    prepareToSendEmail(user, subject, htmlMessage);
  },
  async sendTestMail(locale, user) {
    i18n.setLocale(locale);
    const subject = i18n.__("testmail.SUBJECT");
    const htmlMessage = i18n.__("testmail.MESSAGE", user.name);
    prepareToSendEmail(user, subject, htmlMessage);
  },
};
