import { FaUserMd, FaGraduationCap, FaAward, FaHeart, FaStethoscope, FaMicroscope } from "react-icons/fa";
import doctorImage1 from "../assets/doctors/doctorimage1.jpg";
import doctorImage2 from "../assets/doctors/doctorimage2.jpg";
import doctorImage3 from "../assets/doctors/doctorimage3.jpg";
import doctorImage4 from "../assets/doctors/doctorimage4.jpg";
import doctorImage5 from "../assets/doctors/doctorimage5.jpg";
import doctorImage6 from "../assets/doctors/doctorimage6.jpg";


const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Etsub Zewdu",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      experience: "5+ years",
      education: "MD, Harvard Medical School",
      image: doctorImage1,
      description: "Leading our medical team with expertise in preventive care and chronic disease management."
    },
    {
      name: "Dr. Elsa Abera",
      role: "Head of Cardiology",
      specialty: "Cardiovascular Medicine",
      experience: "12+ years",
      education: "MD, Johns Hopkins University",
      image: doctorImage2,
      description: "Specializing in advanced cardiac procedures and preventive cardiology."
    },
    {
      name: "Dr. Abigiya Elias",
      role: "Pediatric Specialist",
      specialty: "Pediatrics",
      experience: "10+ years",
      education: "MD, Stanford University",
      image: doctorImage3,
      description: "Dedicated to providing compassionate care for children and adolescents."
    },
    {
      name: "Dr. Hana Ayalew",
      role: "Emergency Medicine",
      specialty: "Emergency Care",
      experience: "8+ years",
      education: "MD, University of California",
      image: doctorImage4,
      description: "Expert in emergency medicine and trauma care with rapid response expertise."
    },
    {
      name: "Dr. Hana Chernet",
      role: "Dermatology Specialist",
      specialty: "Dermatology",
      experience: "11+ years",
      education: "MD, Yale University",
      image: doctorImage5,
      description: "Specializing in skin health, cosmetic dermatology, and skin cancer prevention."
    },
    {
      name: "Dr. Rahmet Mekbib",
      role: "Orthopedic Surgeon",
      specialty: "Orthopedics",
      experience: "14+ years",
      education: "MD, Mayo Clinic",
      image: doctorImage6,
      description: "Expert in joint replacement, sports medicine, and minimally invasive surgery."
    }
  ];

  const specialties = [
    { icon: FaHeart, name: "Cardiology", count: "5 specialists" },
    { icon: FaStethoscope, name: "Internal Medicine", count: "8 specialists" },
    { icon: FaMicroscope, name: "Pathology", count: "3 specialists" },
    { icon: FaUserMd, name: "Emergency Medicine", count: "6 specialists" }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Our <span className="text-green-600">Medical Team</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our world-class team of healthcare professionals dedicated to providing 
          exceptional medical care and improving patient outcomes.
        </p>
      </div>

      {/* Specialties Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {specialties.map((specialty, index) => (
          <div key={index} className="healthcare-card p-6 text-center">
            <specialty.icon className="text-4xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{specialty.name}</h3>
            <p className="text-gray-600">{specialty.count}</p>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="healthcare-card p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-green-600 font-semibold mb-1">{member.role}</p>
              <p className="text-gray-500 text-sm mb-2">{member.specialty}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="text-gray-400" />
                <span className="text-sm text-gray-600">{member.education}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaAward className="text-gray-400" />
                <span className="text-sm text-gray-600">{member.experience} experience</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
          </div>
        ))}
      </div>

      {/* Join Our Team */}
      <div className="mt-16 text-center">
        <div className="healthcare-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for talented healthcare professionals to join our mission 
            of providing exceptional patient care. If you're passionate about healthcare 
            and want to make a difference, we'd love to hear from you.
          </p>
          <button className="healthcare-btn-primary">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
