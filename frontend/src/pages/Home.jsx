import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaTint,
  FaPills,
  FaChartLine,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaHeart,
  FaUsers,
  FaAward,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useState } from "react";

// Hero + service placeholder images 
import heroImage from "../assets/hero.png";
import doctorImage from "../assets/doctor.jpg";
import bloodImage from "../assets/blood.jpg";
import pharmacyImage from "../assets/Pharmacy.jpg";
import healthImage from "../assets/health.jpg";

const Home = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      title: "Doctor Appointments",
      description:
        "Book appointments with qualified doctors easily and conveniently.",
      icon: FaUserMd,
      color: "from-green-500 to-green-600",
      image: doctorImage,
      features: ["24/7 Booking", "Expert Doctors", "Video Consultations"],
      details: {
        description:
          "Connect with certified healthcare professionals for comprehensive medical care. Both in-person and virtual consultations with specialists across fields.",
        benefits: [
          "Access to 200+ certified doctors",
          "Same-day emergency appointments",
          "Video consultations available",
          "Prescription management",
          "Medical history tracking",
        ],
        process: [
          "Choose your preferred doctor",
          "Select appointment time",
          "Complete health questionnaire",
          "Attend consultation",
          "Receive follow-up care",
        ],
        pricing: "Starting from $50 per consultation",
      },
    },
    {
      title: "Blood Bank",
      description:
        "Donate blood or request blood donations from our community bank.",
      icon: FaTint,
      color: "from-red-500 to-red-600",
      image: bloodImage,
      features: ["Safe Donations", "Emergency Requests", "Blood Matching"],
      details: {
        description:
          "Join our life-saving community blood bank. Donate blood to help others or request donations during emergencies with our advanced matching system.",
        benefits: [
          "Real-time blood availability",
          "Emergency response system",
          "Donor health screening",
          "Blood type matching",
          "Community impact tracking",
        ],
        process: [
          "Register as donor/recipient",
          "Complete health screening",
          "Schedule donation/appointment",
          "Receive confirmation",
          "Track your impact",
        ],
        pricing: "Free service for all users",
      },
    },
    {
      title: "Medicine Pharmacy",
      description: "Order prescribed medicines online with home delivery.",
      icon: FaPills,
      color: "from-purple-500 to-purple-600",
      image: pharmacyImage,
      features: ["Home Delivery", "Prescription Upload", "Medicine Tracking"],
      details: {
        description:
          "Get your prescribed medications delivered to your doorstep. Our licensed pharmacy partners ensure safe, authentic medicines with professional consultation.",
        benefits: [
          "5,000+ medicines available",
          "Same-day delivery",
          "Prescription verification",
          "Medicine interaction checks",
          "Refill reminders",
        ],
        process: [
          "Upload prescription",
          "Select medicines",
          "Choose delivery time",
          "Make payment",
          "Track delivery",
        ],
        pricing: "Competitive pricing with insurance coverage",
      },
    },
    {
      title: "Health Monitoring",
      description: "Track your health records and get personalized insights.",
      icon: FaChartLine,
      color: "from-blue-500 to-blue-600",
      image: healthImage,
      features: ["Health Records", "AI Insights", "Progress Tracking"],
      details: {
        description:
          "Monitor your health with our AI-powered platform. Track vital signs, receive insights, and maintain health records.",
        benefits: [
          "AI health analysis",
          "Vital signs tracking",
          "Health trend analysis",
          "Personalized recommendations",
          "Family health management",
        ],
        process: [
          "Connect health devices",
          "Input health data",
          "Receive AI insights",
          "Track progress",
          "Share with doctors",
        ],
        pricing: "Free basic plan, Premium $9.99/month",
      },
    },
  ];

  const features = [
    {
      icon: FaShieldAlt,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security",
    },
    {
      icon: FaClock,
      title: "24/7 Support",
      description: "Round-the-clock assistance from healthcare professionals",
    },
    {
      icon: FaHeart,
      title: "Patient-Centered",
      description: "Care designed around your needs and preferences",
    },
    {
      icon: FaAward,
      title: "Certified Quality",
      description: "Accredited healthcare services meeting global standards",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Patients", icon: FaUsers },
    { number: "200+", label: "Expert Doctors", icon: FaUserMd },
    { number: "24/7", label: "Support Available", icon: FaClock },
    { number: "5,000+", label: "Medicines Available", icon: FaPills },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
     <section className="relative bg-gradient-to-r from-[#0F5132] to-[#115E3B] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="relative z-10">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Helping People Lead
              <span className="block text-green-200">
                Healthy & Happy Lives
              </span>
            </h1>
            <p className="text-lg lg:text-xl mb-10 text-green-100 max-w-xl leading-relaxed">
              Your trusted partner for modern healthcare. Access top doctors,
              pharmacy services, blood bank, and health monitoring all in one
              place.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link className="healthcare-btn-primary text-lg px-8 py-4 shadow-lg flex items-center justify-center" to="/appointments">
                Find a Doctor
                <FaArrowRight className="ml-2" />
              </Link>
              <Link className="healthcare-btn-secondary text-lg px-8 py-4" to="/about">
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl"></div>
              <div className="relative p-2 rounded-full bg-gradient-to-br from-white to-emerald-50 shadow-2xl">
                <div className="relative rounded-full overflow-hidden ring-8 ring-emerald-100 shadow-xl">
                  <img
                    src={heroImage}
                    alt="Healthcare Hero"
                    className="w-full h-auto object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-2 rounded-full bg-white/40"></div>
                <div className="h-2 rounded-full bg-emerald-200/60"></div>
                <div className="h-2 rounded-full bg-white/40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Our Healthcare Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for your medical needs, delivered with
              care and precision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="healthcare-card group cursor-pointer overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-80`}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <service.icon className="text-5xl text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-green-600 font-medium text-sm hover:underline"
                  >
                    Learn More <FaArrowRight className="inline ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Delivering world-class healthcare experiences tailored to you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Trusted by Thousands</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Join thousands who trust us for their healthcare needs. Get started
            today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link className="healthcare-btn-primary text-lg px-8 py-4 shadow-lg" to="/register">
              Get Started Free <FaArrowRight className="ml-2" />
            </Link>
            <Link className="healthcare-btn-secondary text-lg px-8 py-4" to="/login">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-y-auto max-h-[90vh] p-8">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedService.title}</h2>
              <button onClick={() => setSelectedService(null)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <p className="mb-6 text-gray-600">
              {selectedService.details.description}
            </p>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                <ul className="space-y-3">
                  {selectedService.details.benefits.map((b, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <FaCheck className="text-green-500 mt-1" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                <ol className="space-y-3">
                  {selectedService.details.process.map((p, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm font-bold">
                        {i + 1}
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="mt-8 p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Pricing</h3>
              <p className="text-green-700 font-medium">
                {selectedService.details.pricing}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
