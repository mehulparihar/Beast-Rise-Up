import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


/**
 * Send Email (non-blocking)
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} options.html
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

export const orderConfirmationTemplate = (order, user) => `
  <h2>Order Confirmation</h2>
  <p>Hi ${user.name},</p>
  <p>Thank you for your purchase! Your order has been placed successfully.</p>

  <h3>Order ID: ${order._id}</h3>

  <ul>
    ${order.items
      .map(
        (item) =>
          `<li>${item.quantity} × ${item.product.title} — ₹${item.price}</li>`
      )
      .join("")}
  </ul>

  <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

  <p>We will notify you when your order is shipped.</p>
`;


export const orderStatusTemplate = (order, status) => `
  <h2>Order Status Updated</h2>
  <p>Your order <strong>#${order._id}</strong> status has been updated.</p>

  <p><strong>New Status:</strong> ${status.toUpperCase()}</p>

  <p>Thank you for shopping with us!</p>
`;


export const resetPasswordTemplate = (resetLink) => `
  <div style="font-family:Arial;padding:20px;">
    <h2>Password Reset Request</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}"
       style="padding:12px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:6px;">
       Reset Password
    </a>
    <p>This link will expire in 10 minutes.</p>
  </div>
`;


export const otpEmailTemplate = (otp) => `
  <div style="font-family:Arial;padding:20px;">
    <h2>Your OTP Code 🔐</h2>
    <p>Use the OTP below to verify your action:</p>
    <h1 style="letter-spacing:4px;">${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
  </div>
`;
