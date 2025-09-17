import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { FaUserMd, FaCalendarAlt, FaClock, FaSpinner, FaCheck } from "react-icons/fa";

const AppointmentForm = () => {
  const { useDoctors, useBookAppointment } = useApi();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { mutate: bookAppointment, isPending: isBooking } = useBookAppointment();
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.time) {
      return;
    }
    
    bookAppointment(formData, {
      onSuccess: () => {
        setIsSubmitted(true);
        setFormData({ doctorId: "", date: "", time: "", reason: "" });
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    });
  };

  if (loadingDoctors) {
    return (
      <div className="healthcare-card p-8 text-center">
        <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="healthcare-card p-8 text-center">
        <FaCheck className="text-6xl text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">Appointment Booked!</h3>
        <p className="text-gray-600">Your appointment has been successfully booked. You will receive a confirmation shortly.</p>
      </div>
    );
  }

  return (
    <div className="healthcare-card p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <FaUserMd className="text-green-500 mr-2" />
        Book New Appointment
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="healthcare-label">Select Doctor *</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="healthcare-select"
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors?.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="healthcare-label">Appointment Date *</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="healthcare-input pl-10"
                required
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="healthcare-label">Preferred Time *</label>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="healthcare-input pl-10"
                required
              />
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="healthcare-label">Reason for Visit (Optional)</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Briefly describe your symptoms or reason for the appointment..."
            className="healthcare-textarea"
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          disabled={isBooking || !formData.doctorId || !formData.date || !formData.time}
          className="healthcare-btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBooking ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Booking...</span>
            </>
          ) : (
            <>
              <FaCheck />
              <span>Book Appointment</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;