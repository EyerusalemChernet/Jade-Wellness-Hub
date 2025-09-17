import { FaBriefcase, FaMapMarkerAlt, FaClock, FaUsers, FaGraduationCap } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobApplicationModal from "../components/JobApplicationModal.jsx";

const Careers = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyNow = (jobTitle) => {
    setSelectedJob(jobTitle);
    setIsModalOpen(true);
  };

  const handleViewAllPositions = () => {
    // Scroll to job openings section
    const jobSection = document.getElementById('job-openings');
    if (jobSection) {
      jobSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jobOpenings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      description: "Join our engineering team to build the next generation of healthcare technology."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "2-4 years",
      description: "Design intuitive and accessible healthcare experiences for patients and providers."
    },
    {
      title: "Medical Data Analyst",
      department: "Data Science",
      location: "New York, NY",
      type: "Full-time",
      experience: "2-3 years",
      description: "Analyze healthcare data to improve patient outcomes and operational efficiency."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "1-3 years",
      description: "Help healthcare providers maximize the value of our platform."
    }
  ];

  const benefits = [
    { icon: FaUsers, title: "Health Insurance", description: "Comprehensive medical, dental, and vision coverage" },
    { icon: FaClock, title: "Flexible Hours", description: "Work-life balance with flexible scheduling" },
    { icon: FaGraduationCap, title: "Learning Budget", description: "Annual budget for professional development" },
    { icon: FaBriefcase, title: "Remote Work", description: "Work from anywhere with our remote-first culture" }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Join Our <span className="text-green-600">Team</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Help us revolutionize healthcare by joining a team of passionate professionals 
          dedicated to improving patient care through technology.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {benefits.map((benefit, index) => (
          <div key={index} className="healthcare-card p-6 text-center">
            <benefit.icon className="text-4xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Job Openings */}
      <div id="job-openings" className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Current Openings
        </h2>
        
        <div className="space-y-6">
          {jobOpenings.map((job, index) => (
            <div key={index} className="healthcare-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaBriefcase className="mr-1" />
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {job.type}
                    </span>
                    <span>{job.experience} experience</span>
                  </div>
                </div>
                <button 
                  className="healthcare-btn-primary"
                  onClick={() => handleApplyNow(job.title)}
                >
                  Apply Now
                </button>
              </div>
              <p className="text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="text-center">
        <div className="healthcare-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're building the future of healthcare technology. Join us in creating solutions 
            that improve patient care and make healthcare more accessible for everyone.
          </p>
          <button 
            className="healthcare-btn-primary"
            onClick={handleViewAllPositions}
          >
            View All Positions
          </button>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={selectedJob}
      />
    </div>
  );
};

export default Careers;
