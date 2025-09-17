import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click the 'Sign Up' button on our homepage, fill out the registration form with your personal information, and verify your email address. You'll then be able to access all our healthcare services."
    },
    {
      question: "Is my medical information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your medical information. We are HIPAA compliant and follow strict privacy protocols to ensure your data is safe and secure."
    },
    {
      question: "How do I book an appointment?",
      answer: "To book an appointment, log into your account, go to the Dashboard, and click 'Book Appointment'. Select your preferred doctor, choose an available time slot, and fill out the appointment form. You'll receive a confirmation email once scheduled."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time. Go to your Dashboard, find your appointment, and click 'Reschedule' or 'Cancel'. For urgent changes, please call our support line."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and insurance payments. We also offer flexible payment plans for certain services. All payments are processed securely."
    },
    {
      question: "How do I access my medical records?",
      answer: "Your medical records are available in the Medical Records section of your dashboard. You can view test results, appointment history, prescriptions, and other medical information. All records are securely stored and HIPAA compliant."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, we have a mobile app available for both iOS and Android devices. You can download it from the App Store or Google Play Store. The app provides full access to all our services on the go."
    },
    {
      question: "What if I have a medical emergency?",
      answer: "For medical emergencies, please call 911 immediately or go to your nearest emergency room. Our platform is not intended for emergency medical situations. For urgent but non-emergency medical concerns, contact your healthcare provider directly."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact our customer support team through the Help Center on our website, by email at support@jadewellness.com, or by phone at +1 (555) 123-4567. Our support team is available Monday through Friday, 8 AM to 8 PM."
    },
    {
      question: "Can I use your services without insurance?",
      answer: "Yes, you can use our services without insurance. We offer competitive self-pay rates and flexible payment options. We also work with various insurance providers to help you maximize your coverage benefits."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Frequently Asked <span className="text-green-600">Questions</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to the most common questions about our healthcare platform and services.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="healthcare-card">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <FaQuestionCircle className="text-green-500 text-xl flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="ml-8 border-l-2 border-green-200 pl-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="healthcare-card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <button className="healthcare-btn-primary">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
