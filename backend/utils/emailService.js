import nodemailer from "nodemailer";
import env from "../config/env.js";

const hasSmtpConfig = Boolean(env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_USER && env.EMAIL_PASS);

let transporter;
if (hasSmtpConfig) {
  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    secure: false, // Brevo uses port 587 with STARTTLS, not SSL
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
} else if (env.__IS_PROD) {
  // In production, missing SMTP is a hard error
  console.error("SMTP configuration missing in environment");
  throw new Error("SMTP configuration missing");
} else {
  // In development, create a no-op transporter
  console.warn("[email] SMTP env not set. Emails will be skipped in development.");
  transporter = {
    verify: async () => true,
    sendMail: async () => ({ messageId: "dev-skip", skipped: true })
  };
}

const verifyEmailTransport = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (err) {
    if (!env.__IS_PROD) {
      console.warn("[email] verify skipped in development:", err.message);
      return false;
    }
    throw err;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"JadeWellness" <${env.EMAIL_USER || "no-reply@local.dev"}>`,
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
    });
    if (!env.__IS_PROD) {
      console.warn("[email] send skipped in development.");
      return { skipped: true };
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// HTML Templates
const welcomeEmailTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to JadeWellness, ${name}!</h2>
    <p>Thank you for joining our healthcare platform. We're excited to help you manage your health needs.</p>
    <p>Explore our services, book appointments, and connect with our community.</p>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Team</p>
  </div>
`;

const appointmentConfirmationTemplate = (userName, doctorName, date, time) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Appointment Confirmation</h2>
    <p>Dear ${userName},</p>
    <p>Your appointment with Dr. ${doctorName} on ${date} at ${time} has been successfully booked.</p>
    <p>Please arrive 10 minutes early. Contact us if you need to reschedule.</p>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Team</p>
  </div>
`;

const donationConfirmationTemplate = (name, bloodType) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Thank You for Your Blood Donation</h2>
    <p>Dear ${name},</p>
    <p>We have received your donation request for blood type <strong>${bloodType}</strong>. Our team will contact you shortly to schedule your donation appointment.</p>
    <p>Your contribution can save lives. Thank you for being a hero.</p>
    <p style="margin-top: 20px;">Warm regards,<br/>The JadeWellness Team</p>
  </div>
`;

const passwordResetTemplate = (name, resetLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Password Reset Request</h2>
    <p>Dear ${name},</p>
    <p>We received a request to reset your password. Click the link below to reset it:</p>
    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Team</p>
  </div>
`;

const doctorWelcomeTemplate = (name, email, password) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to JadeWellness Doctor Portal</h2>
    <p>Dear Dr. ${name},</p>
    <p>Your doctor account has been successfully created on the JadeWellness platform.</p>
    <p><strong>Login Credentials:</strong></p>
    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Temporary Password:</strong> ${password}</li>
    </ul>
    <p>Please log in and change your password immediately for security reasons.</p>
    <p>You can now access the doctor dashboard to manage your appointments and patients.</p>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Team</p>
  </div>
`;

const jobApplicationTemplate = (name, position) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Job Application Received - JadeWellness</h2>
    <p>Dear ${name},</p>
    <p>Thank you for your interest in joining our team! We have received your application for the <strong>${position}</strong> position.</p>
    <p>Our HR team will review your application and get back to you within 5-7 business days.</p>
    <p>If you have any questions, please don't hesitate to contact us at careers@jadewellness.com</p>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness HR Team</p>
  </div>
`;

const jobApplicationNotificationTemplate = (applicationData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>New Job Application Received</h2>
    <p><strong>Position:</strong> ${applicationData.position}</p>
    <p><strong>Applicant:</strong> ${applicationData.name}</p>
    <p><strong>Email:</strong> ${applicationData.email}</p>
    <p><strong>Phone:</strong> ${applicationData.phone}</p>
    <p><strong>Experience:</strong> ${applicationData.experience}</p>
    <p><strong>Applied At:</strong> ${applicationData.appliedAt.toLocaleString()}</p>
    ${applicationData.resumeUrl ? `<p><strong>Resume:</strong> <a href="${applicationData.resumeUrl}">Download Resume</a></p>` : ''}
    <p><strong>Cover Letter:</strong></p>
    <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${applicationData.coverLetter}</p>
  </div>
`;

const orderConfirmationTemplate = (name, orderDetails) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Order Confirmation - JadeWellness Pharmacy</h2>
    <p>Dear ${name},</p>
    <p>Thank you for your order! We have received your prescription and will verify it before processing.</p>
    <p><strong>Order Details:</strong></p>
    <ul>
      ${orderDetails.medicines.map(med => `<li>${med.name} - Quantity: ${med.quantity} - $${med.price}</li>`).join('')}
    </ul>
    <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
    <p>We will verify your prescription and send you a confirmation email once your order is ready for delivery.</p>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Pharmacy Team</p>
  </div>
`;

const twoFactorSetupTemplate = (name, backupCodes) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Two-Factor Authentication Setup - JadeWellness</h2>
    <p>Dear ${name},</p>
    <p>You have successfully set up two-factor authentication for your JadeWellness account.</p>
    <p><strong>Your Backup Codes:</strong></p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
      ${backupCodes.map(code => `<div style="font-family: monospace; font-size: 16px; margin: 5px 0;">${code}</div>`).join('')}
    </div>
    <p><strong>Important:</strong></p>
    <ul>
      <li>Store these backup codes in a safe place</li>
      <li>Each code can only be used once</li>
      <li>Use these codes if you lose access to your authenticator app</li>
      <li>You can generate new backup codes anytime in your security settings</li>
    </ul>
    <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Security Team</p>
  </div>
`;

export { 
  verifyEmailTransport, 
  sendEmail, 
  welcomeEmailTemplate, 
  appointmentConfirmationTemplate, 
  donationConfirmationTemplate, 
  passwordResetTemplate, 
  doctorWelcomeTemplate,
  jobApplicationTemplate,
  jobApplicationNotificationTemplate,
  orderConfirmationTemplate,
  twoFactorSetupTemplate
};