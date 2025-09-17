import { useState } from "react";
import { FaTimes, FaQrcode, FaKey, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api.js";

const TwoFactorModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("setup"); // setup, verify, backup
  const [qrCode, setQrCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/2fa/setup");
      setQrCode(response.data.qrCode);
      setBackupCodes(response.data.backupCodes);
      setStep("verify");
      toast.success("2FA setup initiated. Scan the QR code with your authenticator app.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to setup 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/2fa/verify-setup", { token });
      setStep("backup");
      toast.success("2FA enabled successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join("\n");
    navigator.clipboard.writeText(codesText);
    toast.success("Backup codes copied to clipboard");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {step === "setup" && (
            <div className="text-center space-y-4">
              <FaQrcode className="text-4xl text-blue-500 mx-auto" />
              <h3 className="text-xl font-semibold">Enable Two-Factor Authentication</h3>
              <p className="text-gray-600">
                Add an extra layer of security to your account by enabling 2FA.
              </p>
              <button
                onClick={handleSetup}
                disabled={isLoading}
                className="healthcare-btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? "Setting up..." : "Enable 2FA"}
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Scan QR Code</h3>
                {qrCode && (
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-4">
                  Use your authenticator app (Google Authenticator, Authy, etc.) to scan this QR code.
                </p>
              </div>

              <div>
                <label className="healthcare-label">Enter 6-digit code</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="healthcare-input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isLoading || token.length !== 6}
                className="healthcare-btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Enable"}
              </button>
            </div>
          )}

          {step === "backup" && (
            <div className="space-y-4">
              <div className="text-center">
                <FaKey className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Save Your Backup Codes</h3>
                <p className="text-gray-600 text-sm">
                  Store these codes in a safe place. Each code can only be used once.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={copyBackupCodes}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Copy Backup Codes
              </button>

              <button
                onClick={handleComplete}
                className="healthcare-btn-primary w-full"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;



