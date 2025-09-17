import { FaFileContract, FaGavel, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const Terms = () => {
  const termsSections = [
    {
      icon: FaFileContract,
      title: "Acceptance of Terms",
      content: "By accessing and using Jade Wellness services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: FaGavel,
      title: "Use License",
      content: "Permission is granted to temporarily download one copy of the materials on Jade Wellness for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      icon: FaExclamationTriangle,
      title: "Disclaimer",
      content: "The materials on Jade Wellness are provided on an 'as is' basis. Jade Wellness makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      icon: FaCheckCircle,
      title: "Limitations",
      content: "In no event shall Jade Wellness or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Jade Wellness, even if Jade Wellness or an authorized representative has been notified orally or in writing of the possibility of such damage."
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Terms of <span className="text-green-600">Service</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Please read these terms of service carefully before using our platform. 
          By using our services, you agree to be bound by these terms.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {termsSections.map((section, index) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Email: legal@jadewellness.com</p>
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

export default Terms;
