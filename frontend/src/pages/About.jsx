import { FaHeart, FaUsers, FaAward, FaShieldAlt, FaStethoscope, FaGlobe, FaHandsHelping } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Doctor1 from "../assets/doctors/doctorimage1.jpg";
import Doctor2 from "../assets/doctors/doctorimage2.jpg";
import Doctor3 from "../assets/doctors/doctorimage3.jpg";

const About = () => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLearnMore = () => {
    setShowLearnMore(true);
  };

  const teamMembers = [
    {
      name: "Dr. Etsub Zewdu",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      image: Doctor1,
      description: "Leading our medical team with over 15 years of experience in healthcare management."
    },
    {
      name: "Dr. Elsa Abera",
      role: "Head of Technology",
      specialty: "Health Informatics",
      image: Doctor2,
      description: "Pioneering digital health solutions to improve patient care and accessibility."
    },
    {
      name: "Dr. Abigiya Elias",
      role: "Director of Operations",
      specialty: "Healthcare Administration",
      image: Doctor3,
      description: "Ensuring seamless operations and exceptional patient experiences across all services."
    }
  ];

  const values = [
    {
      icon: FaHeart,
      title: "Patient-Centered Care",
      description: "Every decision we make is guided by what's best for our patients and their families."
    },
    {
      icon: FaShieldAlt,
      title: "Safety & Security",
      description: "We maintain the highest standards of medical safety and data security."
    },
    {
      icon: FaStethoscope,
      title: "Medical Excellence",
      description: "Our team of certified professionals delivers evidence-based, quality healthcare."
    },
    {
      icon: FaGlobe,
      title: "Accessibility",
      description: "Making healthcare accessible to everyone, regardless of location or circumstances."
    }
  ];

  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About <span className="text-green-600">Jade Wellness</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We are a comprehensive healthcare platform dedicated to making quality medical care 
          accessible, convenient, and personalized for everyone. Our mission is to bridge the 
          gap between patients and healthcare providers through innovative technology and 
          compassionate care.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="healthcare-card p-8">
          <div className="flex items-center mb-6">
            <FaHeart className="text-4xl text-red-500 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To revolutionize healthcare delivery by providing a seamless, integrated platform 
            that connects patients with qualified healthcare professionals, making quality 
            medical care accessible to everyone, everywhere, at any time.
          </p>
        </div>

        <div className="healthcare-card p-8">
          <div className="flex items-center mb-6">
            <FaGlobe className="text-4xl text-blue-500 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To become the leading global healthcare platform that transforms how people access, 
            manage, and experience healthcare, creating a healthier world through technology 
            and compassionate care.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="healthcare-card p-6 text-center">
              <value.icon className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="healthcare-card p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-green-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-500 mb-4">{member.specialty}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="healthcare-card p-8 mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
            <p className="text-gray-600">Patients Served</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
            <p className="text-gray-600">Healthcare Providers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">50,000+</div>
            <p className="text-gray-600">Appointments Booked</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">99.9%</div>
            <p className="text-gray-600">Uptime</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="healthcare-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're a patient looking for quality healthcare or a healthcare provider 
            wanting to expand your reach, we invite you to be part of our journey to transform 
            healthcare delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="healthcare-btn-primary"
              onClick={handleGetStarted}
            >
              Get Started Today
            </button>
            <button 
              className="healthcare-btn-secondary"
              onClick={handleLearnMore}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">About JadeWellness</h2>
              <button
                onClick={() => setShowLearnMore(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Story</h3>
                <p className="text-gray-600 leading-relaxed">
                  Founded in 2020, JadeWellness emerged from a vision to make quality healthcare accessible to everyone. 
                  Our founders, a team of healthcare professionals and technology experts, recognized the growing need 
                  for integrated digital health solutions that could bridge the gap between patients and providers.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Offer</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Comprehensive telemedicine services with certified healthcare providers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Online pharmacy with prescription verification and home delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Blood bank services connecting donors with those in need</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Digital health records and appointment management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>AI-powered health monitoring and insights</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h3>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to maintaining the highest standards of medical care, data security, and patient privacy. 
                  Our platform is HIPAA compliant and uses state-of-the-art encryption to protect your health information. 
                  We continuously invest in technology and training to ensure our services meet the evolving needs of our community.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowLearnMore(false)}
                  className="healthcare-btn-primary px-6 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
