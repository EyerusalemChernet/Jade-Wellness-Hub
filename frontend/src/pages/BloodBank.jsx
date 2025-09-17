import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { toast } from "react-toastify";
import { FaTint, FaHeart, FaCalendarAlt, FaUser, FaPhone, FaSpinner, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const BloodBank = () => {
  const { useBloodBank, useDonateBlood } = useApi();
  const { data: bloods, isLoading } = useBloodBank();
  const { mutate: donateBlood, isPending: isDonating } = useDonateBlood();
  const [activeTab, setActiveTab] = useState("donate");
  const [donationForm, setDonationForm] = useState({
    bloodType: "",
    quantity: "",
    donorName: "",
    phone: "",
    email: "",
    lastDonation: "",
    healthStatus: "good"
  });
  const [requestForm, setRequestForm] = useState({
    bloodType: "",
    quantity: "",
    patientName: "",
    phone: "",
    urgency: "normal",
    hospital: "",
    reason: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleDonationChange = (e) => {
    setDonationForm({
      ...donationForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDonate = (e) => {
    e.preventDefault();
    donateBlood(donationForm, {
      onSuccess: () => {
        setIsSubmitted(true);
        setDonationForm({
          bloodType: "",
          quantity: "",
          donorName: "",
          phone: "",
          email: "",
          lastDonation: "",
          healthStatus: "good"
        });
        setTimeout(() => setIsSubmitted(false), 3000);
        toast.success("Thank you for your donation! We'll contact you to schedule a donation appointment.");
      }
    });
  };

  const handleRequest = (e) => {
    e.preventDefault();
    toast.success("Blood request submitted! We'll contact you within 24 hours.");
    setRequestForm({
      bloodType: "",
      quantity: "",
      patientName: "",
      phone: "",
      urgency: "normal",
      hospital: "",
      reason: ""
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="healthcare-card p-8 text-center">
          <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading blood bank data...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto py-10">
        <div className="healthcare-card p-8 text-center">
          <FaCheck className="text-6xl text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">Donation Registered!</h3>
          <p className="text-gray-600">Thank you for your willingness to donate blood. Our team will contact you within 24 hours to schedule your donation appointment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <FaTint className="text-red-500 mr-3" />
          Blood Bank
        </h1>
        <p className="text-xl text-gray-600">Save lives through blood donation and emergency requests</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("donate")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "donate"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaHeart className="inline mr-2" />
            Donate Blood
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "request"
                ? "bg-red-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaExclamationTriangle className="inline mr-2" />
            Request Blood
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Form */}
        {activeTab === "donate" && (
          <div className="healthcare-card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaHeart className="text-red-500 mr-2" />
              Blood Donation Registration
            </h3>
            
            <form onSubmit={handleDonate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="healthcare-label">Blood Type *</label>
                  <select
                    name="bloodType"
                    value={donationForm.bloodType}
                    onChange={handleDonationChange}
                    className="healthcare-select"
                    required
                  >
                    <option value="">Select your blood type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="healthcare-label">Donation Amount *</label>
                  <select
                    name="quantity"
                    value={donationForm.quantity}
                    onChange={handleDonationChange}
                    className="healthcare-select"
                    required
                  >
                    <option value="">Select amount</option>
                    <option value="250ml">250ml (Half Unit)</option>
                    <option value="500ml">500ml (Full Unit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="healthcare-label">Full Name *</label>
                  <input
                    type="text"
                    name="donorName"
                    value={donationForm.donorName}
                    onChange={handleDonationChange}
                    className="healthcare-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="healthcare-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={donationForm.phone}
                    onChange={handleDonationChange}
                    className="healthcare-input"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="healthcare-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={donationForm.email}
                  onChange={handleDonationChange}
                  className="healthcare-input"
                  placeholder="Enter your email (optional)"
                />
              </div>

              <div>
                <label className="healthcare-label">Last Donation Date</label>
                <input
                  type="date"
                  name="lastDonation"
                  value={donationForm.lastDonation}
                  onChange={handleDonationChange}
                  className="healthcare-input"
                />
              </div>

              <div>
                <label className="healthcare-label">Current Health Status *</label>
                <select
                  name="healthStatus"
                  value={donationForm.healthStatus}
                  onChange={handleDonationChange}
                  className="healthcare-select"
                  required
                >
                  <option value="good">Good - No health issues</option>
                  <option value="minor">Minor - Minor cold/flu</option>
                  <option value="poor">Poor - Not suitable for donation</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isDonating}
                className="healthcare-btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isDonating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <FaHeart />
                    <span>Register for Donation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Request Form */}
        {activeTab === "request" && (
          <div className="healthcare-card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              Blood Request Form
            </h3>
            
            <form onSubmit={handleRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="healthcare-label">Required Blood Type *</label>
                  <select
                    name="bloodType"
                    value={requestForm.bloodType}
                    onChange={handleRequestChange}
                    className="healthcare-select"
                    required
                  >
                    <option value="">Select required blood type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="healthcare-label">Quantity Needed *</label>
                  <select
                    name="quantity"
                    value={requestForm.quantity}
                    onChange={handleRequestChange}
                    className="healthcare-select"
                    required
                  >
                    <option value="">Select quantity</option>
                    <option value="1">1 Unit (500ml)</option>
                    <option value="2">2 Units (1000ml)</option>
                    <option value="3">3 Units (1500ml)</option>
                    <option value="4+">4+ Units (2000ml+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="healthcare-label">Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={requestForm.patientName}
                    onChange={handleRequestChange}
                    className="healthcare-input"
                    placeholder="Enter patient's full name"
                    required
                  />
                </div>

                <div>
                  <label className="healthcare-label">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={requestForm.phone}
                    onChange={handleRequestChange}
                    className="healthcare-input"
                    placeholder="Enter contact phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="healthcare-label">Hospital/Clinic *</label>
                <input
                  type="text"
                  name="hospital"
                  value={requestForm.hospital}
                  onChange={handleRequestChange}
                  className="healthcare-input"
                  placeholder="Enter hospital or clinic name"
                  required
                />
              </div>

              <div>
                <label className="healthcare-label">Urgency Level *</label>
                <select
                  name="urgency"
                  value={requestForm.urgency}
                  onChange={handleRequestChange}
                  className="healthcare-select"
                  required
                >
                  <option value="normal">Normal - Within 48 hours</option>
                  <option value="urgent">Urgent - Within 24 hours</option>
                  <option value="emergency">Emergency - Within 6 hours</option>
                </select>
              </div>

              <div>
                <label className="healthcare-label">Reason for Request</label>
                <textarea
                  name="reason"
                  value={requestForm.reason}
                  onChange={handleRequestChange}
                  className="healthcare-textarea"
                  rows={3}
                  placeholder="Briefly describe the reason for blood request..."
                />
              </div>

              <button 
                type="submit" 
                className="healthcare-btn-primary w-full flex items-center justify-center space-x-2"
              >
                <FaExclamationTriangle />
                <span>Submit Blood Request</span>
              </button>
            </form>
          </div>
        )}

        {/* Blood Availability */}
        <div className="healthcare-card p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaTint className="text-red-500 mr-2" />
            Current Blood Availability
          </h3>
          
          {bloods && bloods.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {bloods.map((blood) => (
                <div key={blood._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{blood.bloodType}</div>
                    <div className="text-sm text-gray-600">{blood.quantity} units available</div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                      blood.quantity > 10 ? 'bg-green-100 text-green-800' :
                      blood.quantity > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {blood.quantity > 10 ? 'High Stock' : blood.quantity > 5 ? 'Medium Stock' : 'Low Stock'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaTint className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No blood inventory data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodBank;