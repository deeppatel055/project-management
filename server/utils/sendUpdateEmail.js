const nodemailer = require('nodemailer');

const sendUpdateEmail = async (recipientEmail, { name, updatedBy, changes }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const changeList = changes.map(change => `<li>${change}</li>`).join('');

  const mailOptions = {
    from: `"Project Admin" <${process.env.SMTP_EMAIL}>`,
    to: recipientEmail,
    subject: 'Your account details were updated',
    html: `
      <p>Hello ${name},</p>
      <p>Your account was updated by <strong>${updatedBy}</strong>.</p>
      <p><strong>Changes made:</strong></p>
      <ul>${changeList}</ul>
      <p>If this was not you, please contact support immediately.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendUpdateEmail;
