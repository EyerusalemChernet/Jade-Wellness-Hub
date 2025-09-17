import { useState } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api.js";

const JobApplicationModal = ({ isOpen, onClose, jobTitle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: jobTitle || "",
    experience: "",
    coverLetter: "",
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      await api.post("/api/careers/apply", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Application submitted successfully! We'll contact you soon.");
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: jobTitle || "",
        experience: "",
        coverLetter: "",
        resume: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Apply for {jobTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="healthcare-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="healthcare-input"
                required
              />
            </div>
            <div>
              <label className="healthcare-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="healthcare-input"
                required
              />
            </div>
            <div>
              <label className="healthcare-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="healthcare-input"
                required
              />
            </div>
            <div>
              <label className="healthcare-label">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="healthcare-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="healthcare-label">Years of Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="healthcare-input"
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          <div>
            <label className="healthcare-label">Cover Letter</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={4}
              className="healthcare-input"
              placeholder="Tell us why you're interested in this position..."
            />
          </div>

          <div>
            <label className="healthcare-label">Resume/CV</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FaUpload className="text-2xl text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer text-sm text-gray-600">
                Click to upload resume (PDF, DOC, DOCX)
              </label>
              {formData.resume && (
                <p className="text-sm text-green-600 mt-2">{formData.resume.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="healthcare-btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && <FaSpinner className="animate-spin" />}
              <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;



