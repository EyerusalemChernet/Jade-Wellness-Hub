import { useApi } from "../hooks/useApi.js";
import Sidebar from "../components/Sidebar.jsx";
import { FaCheck, FaTimes, FaClipboardList, FaNotesMedical, FaPills, FaSpinner, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useState } from "react";

const DoctorDashboard = () => {
  const { useDoctorAppointments, useUpdateAppointmentStatus, useAddDoctorNote, useCreatePrescription } = useApi();
  const { data: appointments, isLoading } = useDoctorAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const addNote = useAddDoctorNote();
  const createRx = useCreatePrescription();
  const [noteById, setNoteById] = useState({});
  const [rxById, setRxById] = useState({});

  if (isLoading) return (
    <div className="flex-1 p-4">
      <div className="healthcare-card p-8 text-center">
        <FaSpinner className="animate-spin text-3xl text-green-500 mx-auto mb-3" />
        <p className="text-gray-600">Loading appointments...</p>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="healthcare-card p-4 text-center">
            <FaClipboardList className="text-2xl text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold">{appointments?.filter(a => a.status === 'pending').length || 0}</div>
            <div className="text-gray-600">Pending Requests</div>
          </div>
          <div className="healthcare-card p-4 text-center">
            <FaCalendarAlt className="text-2xl text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold">{appointments?.filter(a => a.status === 'approved').length || 0}</div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="healthcare-card p-4 text-center">
            <FaUser className="text-2xl text-purple-600 mx-auto mb-2" />
            <div className="text-3xl font-bold">{appointments?.length || 0}</div>
            <div className="text-gray-600">Total Appointments</div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {appointments?.map((appt) => (
              <div key={appt._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{appt.user?.name}</div>
                    <div className="text-sm text-gray-600">{new Date(appt.date).toLocaleDateString()} {appt.time}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                      appt.status === 'approved' ? 'bg-green-100 text-green-800' :
                      appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appt.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="healthcare-btn-primary px-3 py-2 text-sm"
                      onClick={() => updateStatus.mutate({ id: appt._id, status: 'approved' })}
                    >
                      <FaCheck className="inline mr-1" /> Approve
                    </button>
                    <button
                      className="healthcare-btn-secondary px-3 py-2 text-sm"
                      onClick={() => updateStatus.mutate({ id: appt._id, status: 'rejected' })}
                    >
                      <FaTimes className="inline mr-1" /> Decline
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <div className="font-semibold mb-2 flex items-center"><FaNotesMedical className="mr-2 text-green-600"/>Notes</div>
                  <ul className="space-y-2 mb-3">
                    {appt.notes?.map((n, idx) => (
                      <li key={idx} className="text-sm text-gray-700">- {n.content}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <input
                      className="healthcare-input flex-1"
                      placeholder="Add a note"
                      value={noteById[appt._id] || ''}
                      onChange={(e) => setNoteById({ ...noteById, [appt._id]: e.target.value })}
                    />
                    <button
                      className="healthcare-btn-secondary"
                      onClick={() => {
                        const content = (noteById[appt._id] || '').trim();
                        if (!content) return;
                        addNote.mutate({ id: appt._id, content });
                        setNoteById({ ...noteById, [appt._id]: '' });
                      }}
                    >Add</button>
                  </div>
                </div>

                {/* Prescriptions */}
                <div className="mt-4">
                  <div className="font-semibold mb-2 flex items-center"><FaPills className="mr-2 text-purple-600"/>Prescriptions</div>
                  <ul className="space-y-2 mb-3">
                    {appt.prescriptions?.map((p, idx) => (
                      <li key={idx} className="text-sm text-gray-700">- {p.medicine} {p.dosage ? `(${p.dosage})` : ''} – {p.status}</li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      className="healthcare-input"
                      placeholder="Medicine"
                      value={rxById[`${appt._id}-medicine`] || ''}
                      onChange={(e) => setRxById({ ...rxById, [`${appt._id}-medicine`]: e.target.value })}
                    />
                    <input
                      className="healthcare-input"
                      placeholder="Dosage"
                      value={rxById[`${appt._id}-dosage`] || ''}
                      onChange={(e) => setRxById({ ...rxById, [`${appt._id}-dosage`]: e.target.value })}
                    />
                    <input
                      className="healthcare-input"
                      placeholder="Instructions"
                      value={rxById[`${appt._id}-instructions`] || ''}
                      onChange={(e) => setRxById({ ...rxById, [`${appt._id}-instructions`]: e.target.value })}
                    />
                  </div>
                  <div className="mt-2">
                    <button
                      className="healthcare-btn-primary"
                      onClick={() => {
                        const medicine = (rxById[`${appt._id}-medicine`] || '').trim();
                        if (!medicine) return;
                        createRx.mutate({
                          id: appt._id,
                          medicine,
                          dosage: rxById[`${appt._id}-dosage`] || '',
                          instructions: rxById[`${appt._id}-instructions`] || ''
                        });
                        setRxById({ ...rxById, [`${appt._id}-medicine`]: '', [`${appt._id}-dosage`]: '', [`${appt._id}-instructions`]: '' });
                      }}
                    >Send Prescription</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;