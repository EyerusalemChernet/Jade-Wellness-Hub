import { FaShieldAlt, FaLock, FaEye, FaUserShield, FaDatabase } from "react-icons/fa";

const Privacy = () => {
  const privacySections = [
    {
      icon: FaShieldAlt,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, book appointments, or contact us for support. This includes personal information like your name, email address, phone number, and medical information necessary for providing healthcare services."
    },
    {
      icon: FaLock,
      title: "How We Use Your Information",
      content: "We use your information to provide, maintain, and improve our services, process appointments, communicate with you, and ensure the security of our platform. We never sell your personal information to third parties."
    },
    {
      icon: FaEye,
      title: "Information Sharing",
      content: "We may share your information with healthcare providers involved in your care, as required by law, or with your explicit consent. We implement strict data sharing agreements to protect your privacy."
    },
    {
      icon: FaUserShield,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request copies of your medical records at any time."
    },
    {
      icon: FaDatabase,
      title: "Data Security",
      content: "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information from unauthorized access, alteration, or disclosure."
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Privacy <span className="text-green-600">Policy</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your privacy is important to us. This policy explains how we collect, use, 
          and protect your personal and medical information.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <div key={index} className="healthcare-card p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <section.icon className="text-3xl text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="healthcare-card p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Email: privacy@jadewellness.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Healthcare Street, Medical District, City 12345</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
