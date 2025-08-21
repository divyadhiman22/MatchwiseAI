import nodemailer from "nodemailer";

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,  
      pass: process.env.GMAIL_PASS,  
    },
  });

  const mailOptions = {
    from: `"MatchwiseAI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;
