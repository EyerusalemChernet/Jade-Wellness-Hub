import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaSpinner, FaCheck } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: "Phone",
      details: ["+251 (940) 49-5767", "+251 (940) 49-5767"],
      description: "Available 24/7 for emergencies"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["support@jadewellness.com", "info@jadewellness.com"],
      description: "We respond within 24 hours"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      details: ["Africa ave Street", "Bole Dembel, No 12345"],
      description: "Visit our main office"
    },
    {
      icon: FaClock,
      title: "Hours",
      details: ["Mon-Fri: 8:00 AM - 8:00 PM", "Sat-Sun: 9:00 AM - 6:00 PM"],
      description: "Emergency services available 24/7"
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Contact <span className="text-green-600">Us</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're here to help! Get in touch with our team for any questions, 
          concerns, or support you may need.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
          
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="healthcare-card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <info.icon className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                    ))}
                    <p className="text-sm text-gray-500 mt-2">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <div className="healthcare-card p-6 mt-8 bg-red-50 border-red-200">
            <div className="flex items-center space-x-3 mb-4">
              <FaPhone className="text-2xl text-red-500" />
              <h3 className="text-xl font-semibold text-red-800">Emergency Contact</h3>
            </div>
            <p className="text-red-700 mb-2">
              For medical emergencies, please call:
            </p>
            <p className="text-2xl font-bold text-red-600">911</p>
            <p className="text-sm text-red-600 mt-2">
              Or visit your nearest emergency room immediately.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
          
          {isSubmitted ? (
            <div className="healthcare-card p-8 text-center">
              <FaCheck className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-700 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <div className="healthcare-card p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="healthcare-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="healthcare-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="healthcare-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="healthcare-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="healthcare-label">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="healthcare-select"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Booking</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="healthcare-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="healthcare-textarea"
                    rows={6}
                    placeholder="Please describe your inquiry in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="healthcare-btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="healthcare-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              How do I book an appointment?
            </h3>
            <p className="text-gray-600">
              You can book an appointment through our online platform by selecting your preferred 
              doctor, choosing an available time slot, and filling out the appointment form.
            </p>
          </div>

          <div className="healthcare-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Is my medical information secure?
            </h3>
            <p className="text-gray-600">
              Yes, we use industry-standard encryption and security measures to protect your 
              personal and medical information. Your privacy is our top priority.
            </p>
          </div>

          <div className="healthcare-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Can I access my medical records online?
            </h3>
            <p className="text-gray-600">
              Absolutely! You can view and manage your medical records, test results, and 
              appointment history through your secure patient portal.
            </p>
          </div>

          <div className="healthcare-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept all major credit cards, insurance plans, and offer flexible payment 
              options to make healthcare accessible for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
