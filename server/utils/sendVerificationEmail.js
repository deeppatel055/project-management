const  jwt = require('jsonwebtoken')
const transporter  = require('./mailer')

const { BASE_URL } = require('../config/constants.js');

const sendVerificationEmail = async (email) => {
    const token = jwt.sign({email}, process.env.EMAIL_SECRET, {expiresIn: '1d'})
   const link = `${BASE_URL}/api/users/verify?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html:`<p>Click <a href="${link}">here</a> to verify your email.</p>`
    })
} 

module.exports = sendVerificationEmail