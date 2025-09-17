import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { FaUserMd, FaPlus, FaSpinner, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api.js";

const DoctorForm = () => {
  const { useAddDoctor } = useApi();
  const { mutate: addDoctor, isLoading } = useAddDoctor();
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    experience: "",
    qualifications: ""
  });
  const [qualificationsFile, setQualificationsFile] = useState(null);
  const [errors, setErrors] = useState({});

  const specialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
    "Hematology", "Neurology", "Oncology", "Orthopedics",
    "Pediatrics", "Psychiatry", "Radiology", "Urology",
    "General Medicine", "Emergency Medicine", "Family Medicine"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Doctor name is required";
    }
    
    if (!formData.specialty) {
      newErrors.specialty = "Specialty is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.experience) {
      newErrors.experience = "Years of experience is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("prescription", file);
      const res = await api.post("/api/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.url;
    } catch (error) {
      toast.error("Failed to upload file");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      let qualificationsFileUrl = "";
      if (qualificationsFile) {
        qualificationsFileUrl = await handleFileUpload(qualificationsFile);
      }

      addDoctor({
        ...formData,
        qualificationsFile: qualificationsFileUrl
      }, {
        onSuccess: () => {
          toast.success("Doctor added successfully!");
          setFormData({
            name: "",
            specialty: "",
            email: "",
            phone: "",
            experience: "",
            qualifications: ""
          });
          setQualificationsFile(null);
          setErrors({});
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to add doctor");
        }
      });
    } catch (error) {
      toast.error("Failed to upload qualifications file");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="healthcare-card p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaUserMd className="text-2xl text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Doctor</h2>
        <p className="text-gray-600">Enter the doctor's information to add them to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Name */}
          <div className="md:col-span-2">
            <label className="healthcare-label">
              Doctor Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter doctor's full name"
              className={`healthcare-input ${errors.name ? 'healthcare-input-error' : ''}`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Specialty */}
          <div>
            <label className="healthcare-label">
              Specialty *
            </label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className={`healthcare-select ${errors.specialty ? 'healthcare-input-error' : ''}`}
              required
            >
              <option value="">Select specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="healthcare-label">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              className={`healthcare-input ${errors.email ? 'healthcare-input-error' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="healthcare-label">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className={`healthcare-input ${errors.phone ? 'healthcare-input-error' : ''}`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="healthcare-label">
              Years of Experience *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={`healthcare-select ${errors.experience ? 'healthcare-input-error' : ''}`}
              required
            >
              <option value="">Select experience</option>
              <option value="0-1">0-1 years</option>
              <option value="2-5">2-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16-20">16-20 years</option>
              <option value="20+">20+ years</option>
            </select>
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
            )}
          </div>
        </div>

        {/* Qualifications */}
        <div>
          <label className="healthcare-label">
            Qualifications & Certifications
          </label>
          <textarea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="Enter doctor's qualifications, certifications, and education background"
            rows={4}
            className="healthcare-textarea"
          />
        </div>

        {/* Qualifications File Upload */}
        <div>
          <label className="healthcare-label">
            Upload Certifications (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="qualifications-file"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="qualifications-file"
                    name="qualifications-file"
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={(e) => setQualificationsFile(e.target.files[0])}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              {qualificationsFile && (
                <p className="text-sm text-green-600">Selected: {qualificationsFile.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="healthcare-btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Adding Doctor...</span>
              </>
            ) : (
              <>
                <FaPlus />
                <span>Add Doctor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;