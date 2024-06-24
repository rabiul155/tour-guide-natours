const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: process.env.NODE_ENV === 'production',
    auth: {
      user: 'siyamict@gmail.com',
      pass: 'gzfj kski psew eumy'
    }
  });

  await transporter.sendMail({
    from: 'siyamict@gmail.com', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: body // plain text body
    // html // html body
  });
};

module.exports = sendEmail;
