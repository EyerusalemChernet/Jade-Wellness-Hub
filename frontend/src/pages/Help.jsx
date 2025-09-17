import { useState } from "react";
import { FaSearch, FaQuestionCircle, FaPhone, FaEnvelope, FaBook, FaVideo, FaDownload } from "react-icons/fa";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "appointments", name: "Appointments" },
    { id: "account", name: "Account & Profile" },
    { id: "billing", name: "Billing & Payments" },
    { id: "technical", name: "Technical Support" },
    { id: "medical", name: "Medical Services" }
  ];

  const faqs = [
    {
      id: 1,
      category: "appointments",
      question: "How do I book an appointment?",
      answer: "To book an appointment, log into your account, go to the Dashboard, and click 'Book Appointment'. Select your preferred doctor, choose an available time slot, and fill out the appointment form. You'll receive a confirmation email once your appointment is scheduled."
    },
    {
      id: 2,
      category: "appointments",
      question: "Can I reschedule or cancel my appointment?",
      answer: "Yes, you can reschedule or cancel your appointment up to 24 hours before the scheduled time. Go to your Dashboard, find your appointment, and click 'Reschedule' or 'Cancel'. For urgent changes, please call our support line."
    },
    {
      id: 3,
      category: "account",
      question: "How do I update my profile information?",
      answer: "To update your profile, go to the Profile section in your dashboard. You can edit your personal information, contact details, and medical history. Remember to save your changes after making updates."
    },
    {
      id: 4,
      category: "billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and insurance payments. We also offer flexible payment plans for certain services. All payments are processed securely through encrypted channels."
    },
    {
      id: 5,
      category: "technical",
      question: "I'm having trouble logging in. What should I do?",
      answer: "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link on the login page. Make sure you're using the correct email address. If the problem persists, contact our technical support team."
    },
    {
      id: 6,
      category: "medical",
      question: "How do I access my medical records?",
      answer: "Your medical records are available in the Medical Records section of your dashboard. You can view test results, appointment history, prescriptions, and other medical information. All records are securely stored and HIPAA compliant."
    },
    {
      id: 7,
      category: "medical",
      question: "Is my medical information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your medical information. We are HIPAA compliant and follow strict privacy protocols. Your data is never shared without your explicit consent."
    },
    {
      id: 8,
      category: "technical",
      question: "The website is loading slowly. What can I do?",
      answer: "Try refreshing your browser or clearing your browser cache. Make sure you have a stable internet connection. If the problem continues, try using a different browser or contact our technical support team for assistance."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const helpResources = [
    {
      icon: FaBook,
      title: "User Guide",
      description: "Complete guide to using our platform",
      action: "Download PDF"
    },
    {
      icon: FaVideo,
      title: "Video Tutorials",
      description: "Step-by-step video instructions",
      action: "Watch Videos"
    },
    {
      icon: FaDownload,
      title: "Mobile App",
      description: "Download our mobile application",
      action: "Get App"
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Help <span className="text-green-600">Center</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions and get the support you need to make the most of our platform.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="healthcare-input pl-12 w-full"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="healthcare-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-start">
                <FaQuestionCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed ml-8">{faq.answer}</p>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No results found for your search.</p>
            <p className="text-sm text-gray-400 mt-2">Try different keywords or browse all categories.</p>
          </div>
        )}
      </div>

      {/* Help Resources */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Additional Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {helpResources.map((resource, index) => (
            <div key={index} className="healthcare-card p-6 text-center">
              <resource.icon className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <button className="healthcare-btn-secondary">
                {resource.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <div className="healthcare-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you 
            with any questions or issues you may have.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="healthcare-btn-primary flex items-center justify-center space-x-2">
              <FaPhone />
              <span>Call Support</span>
            </button>
            <button className="healthcare-btn-secondary flex items-center justify-center space-x-2">
              <FaEnvelope />
              <span>Email Support</span>
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Support Hours: Monday - Friday, 8:00 AM - 8:00 PM</p>
            <p>Emergency Support: Available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
