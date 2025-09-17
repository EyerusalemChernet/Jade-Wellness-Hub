import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { toast } from "react-toastify";
import { FaFileMedical, FaPlus, FaSpinner, FaCheck, FaDownload, FaEye, FaCalendarAlt, FaUserMd, FaHeartbeat, FaPills } from "react-icons/fa";

const MedicalRecords = () => {
  const { useAppointments, useProfile } = useApi();
  const { data: appointments, isLoading: loadingAppointments } = useAppointments();
  const { data: profile } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const [newRecord, setNewRecord] = useState({
    type: "vital",
    value: "",
    unit: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  // Start with empty medical records; populated only by user actions
  const [medicalRecords, setMedicalRecords] = useState([]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRecord.value || !newRecord.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAddingRecord(true);
    setTimeout(() => {
      const record = {
        id: Date.now(),
        type: newRecord.type,
        title: getRecordTitle(newRecord.type),
        value: newRecord.value,
        unit: newRecord.unit,
        date: newRecord.date,
        doctor: "Self-reported",
        notes: newRecord.notes
      };
      setMedicalRecords([record, ...medicalRecords]);
      setNewRecord({
        type: "vital",
        value: "",
        unit: "",
        notes: "",
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddingRecord(false);
      toast.success("Medical record added successfully");
    }, 1000);
  };

  const getRecordTitle = (type) => {
    switch (type) {
      case "vital": return "Vital Signs";
      case "lab": return "Lab Results";
      case "medication": return "Medication";
      case "symptom": return "Symptoms";
      default: return "Medical Record";
    }
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "vital": return <FaHeartbeat className="text-red-500" />;
      case "lab": return <FaFileMedical className="text-blue-500" />;
      case "medication": return <FaPills className="text-purple-500" />;
      case "symptom": return <FaEye className="text-orange-500" />;
      default: return <FaFileMedical className="text-gray-500" />;
    }
  };

  const getRecordTypeColor = (type) => {
    switch (type) {
      case "vital": return "bg-red-100 text-red-800";
      case "lab": return "bg-blue-100 text-blue-800";
      case "medication": return "bg-purple-100 text-purple-800";
      case "symptom": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loadingAppointments) {
    return (
      <div className="container mx-auto py-10">
        <div className="healthcare-card p-8 text-center">
          <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <FaFileMedical className="text-green-500 mr-3" />
          Medical Records
        </h1>
        <p className="text-xl text-gray-600">Track your health journey and medical history</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "records"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Records
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "add"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Add Record
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="healthcare-card p-6 text-center">
            <FaFileMedical className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{medicalRecords.length}</h3>
            <p className="text-gray-600">Total Records</p>
          </div>
          <div className="healthcare-card p-6 text-center">
            <FaUserMd className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</h3>
            <p className="text-gray-600">Appointments</p>
          </div>
          <div className="healthcare-card p-6 text-center">
            <FaHeartbeat className="text-3xl text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {medicalRecords.filter(r => r.type === "vital").length}
            </h3>
            <p className="text-gray-600">Vital Signs</p>
          </div>
          <div className="healthcare-card p-6 text-center">
            <FaPills className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {medicalRecords.filter(r => r.type === "medication").length}
            </h3>
            <p className="text-gray-600">Medications</p>
          </div>
        </div>
      )}

      {/* Records Tab */}
      {activeTab === "records" && (
        <div className="healthcare-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">All Medical Records</h3>
            <button className="healthcare-btn-secondary flex items-center space-x-2">
              <FaDownload />
              <span>Export Records</span>
            </button>
          </div>

          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">
                      {getRecordIcon(record.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{record.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRecordTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <FaUserMd className="mr-1" />
                          {record.doctor}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {record.value} {record.unit}
                    </div>
                    <button className="text-blue-500 hover:text-blue-700 text-sm mt-2">
                      <FaEye className="inline mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Record Tab */}
      {activeTab === "add" && (
        <div className="healthcare-card p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaPlus className="text-green-500 mr-2" />
            Add New Medical Record
          </h3>

          <form onSubmit={handleAddRecord} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="healthcare-label">Record Type *</label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                  className="healthcare-select"
                  required
                >
                  <option value="vital">Vital Signs</option>
                  <option value="lab">Lab Results</option>
                  <option value="medication">Medication</option>
                  <option value="symptom">Symptoms</option>
                </select>
              </div>

              <div>
                <label className="healthcare-label">Date *</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="healthcare-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="healthcare-label">Value/Reading *</label>
                <input
                  type="text"
                  value={newRecord.value}
                  onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                  className="healthcare-input"
                  placeholder="e.g., 120/80, 95, Metformin"
                  required
                />
              </div>

              <div>
                <label className="healthcare-label">Unit</label>
                <input
                  type="text"
                  value={newRecord.unit}
                  onChange={(e) => setNewRecord({ ...newRecord, unit: e.target.value })}
                  className="healthcare-input"
                  placeholder="e.g., mmHg, mg/dL, mg"
                />
              </div>
            </div>

            <div>
              <label className="healthcare-label">Notes</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                className="healthcare-textarea"
                rows={3}
                placeholder="Additional notes or observations..."
              />
            </div>

            <button
              type="submit"
              disabled={isAddingRecord}
              className="healthcare-btn-primary flex items-center justify-center space-x-2"
            >
              {isAddingRecord ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Adding Record...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Add Medical Record</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Recent Appointments */}
      {appointments && appointments.length > 0 && (
        <div className="mt-12">
          <div className="healthcare-card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Appointments</h3>
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Appointment with {appointment.doctor?.name || "Doctor"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                        appointment.status === "approved" ? "bg-green-100 text-green-800" :
                        appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                      <FaEye className="inline mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
