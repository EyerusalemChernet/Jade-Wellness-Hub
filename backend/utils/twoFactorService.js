import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const generateSecret = (userEmail) => {
  const secret = speakeasy.generateSecret({
    name: `JadeWellness (${userEmail})`,
    issuer: "JadeWellness",
    length: 32
  });
  
  return {
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url
  };
};

export const generateQRCode = async (otpauthUrl) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 2 // Allow 2 time steps (60 seconds) of tolerance
  });
};

export const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
};

export const verifyBackupCode = (backupCodes, code) => {
  const index = backupCodes.indexOf(code);
  if (index !== -1) {
    backupCodes.splice(index, 1); // Remove used code
    return true;
  }
  return false;
};



