import nodemailer from "nodemailer";

type sendResetMailType = {
  userEmail: string;
  token: string;
};

export const sendResetMail = async ({
  userEmail,
  token,
}: sendResetMailType) => {
  const { NODE_MAILER_EMAIL, NODE_MAILER_PASSWORD } = process.env;

  if (!NODE_MAILER_EMAIL || !NODE_MAILER_PASSWORD) {
    throw new Error("Missing environment variables for nodemailer");
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: NODE_MAILER_EMAIL,
      pass: NODE_MAILER_PASSWORD,
    },
  });

  // // encoding token
  // const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");

  let mailOptions = {
    from: NODE_MAILER_EMAIL,
    to: userEmail,
    subject: "Reset Password",
    text: `Please click on the following link to reset your password: http://localhost:5173/reset-password/${token}`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
