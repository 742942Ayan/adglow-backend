const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send OTP email
 * @param {string} toEmail - user's email
 * @param {string} otp - OTP code
 */
exports.sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"AdGlow Network" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Your AdGlow OTP Code",
    html: `
      <h2>AdGlow Email Verification</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code is valid for 5 minutes.</p>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`📤 OTP Email sent to ${toEmail} ✅`, result.response);
  } catch (error) {
    console.error(`❌ Failed to send OTP Email to ${toEmail}`, error);
  }
};
