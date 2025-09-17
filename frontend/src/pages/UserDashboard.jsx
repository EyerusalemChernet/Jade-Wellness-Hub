import { useApi } from "../hooks/useApi.js";
import AppointmentForm from "../components/AppointmentForm.jsx";
import DashboardChart from "../components/DashboardChart.jsx";
import { FaSpinner, FaCalendarAlt, FaPills, FaReceipt, FaChartLine, FaUser, FaHeartbeat } from "react-icons/fa";

const UserDashboard = () => {
  const { useAppointments, useMedicines, useOrders } = useApi();
  const { data: appointments, isLoading: loadingAppointments } = useAppointments();
  const { data: medicines, isLoading: loadingMedicines } = useMedicines();
  const { data: orders, isLoading: loadingOrders } = useOrders();

  // Show loading only if all critical data is loading
  const isInitialLoading = loadingAppointments && loadingMedicines && loadingOrders;

  // Prepare chart data
  const appointmentChartData = [
    { name: 'This Month', value: appointments?.length || 0 },
    { name: 'Last Month', value: Math.floor((appointments?.length || 0) * 0.8) },
    { name: '2 Months Ago', value: Math.floor((appointments?.length || 0) * 0.6) }
  ];

  const orderChartData = [
    { name: 'This Month', value: orders?.length || 0 },
    { name: 'Last Month', value: Math.floor((orders?.length || 0) * 0.7) },
    { name: '2 Months Ago', value: Math.floor((orders?.length || 0) * 0.5) }
  ];

  const medicineCategoryData = medicines?.reduce((acc, medicine) => {
    const category = medicine.category || 'Other';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []) || [];

  if (isInitialLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="healthcare-card p-8 text-center">
          <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <FaUser className="text-green-500 mr-3" />
          User Dashboard
        </h1>
        <p className="text-xl text-gray-600">Manage your healthcare services and appointments</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="healthcare-card p-6 text-center">
          <FaCalendarAlt className="text-3xl text-blue-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">
            {loadingAppointments ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              appointments?.length || 0
            )}
          </h3>
          <p className="text-gray-600">Appointments</p>
        </div>
        <div className="healthcare-card p-6 text-center">
          <FaPills className="text-3xl text-purple-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">
            {loadingMedicines ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              medicines?.length || 0
            )}
          </h3>
          <p className="text-gray-600">Medicines</p>
        </div>
        <div className="healthcare-card p-6 text-center">
          <FaReceipt className="text-3xl text-green-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">
            {loadingOrders ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              orders?.length || 0
            )}
          </h3>
          <p className="text-gray-600">Orders</p>
        </div>
        <div className="healthcare-card p-6 text-center">
          <FaHeartbeat className="text-3xl text-red-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">Active</h3>
          <p className="text-gray-600">Health Status</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DashboardChart
          data={appointmentChartData}
          type="bar"
          title="Appointments Over Time"
          height={250}
        />
        <DashboardChart
          data={orderChartData}
          type="line"
          title="Orders Trend"
          height={250}
        />
        <DashboardChart
          data={medicineCategoryData}
          type="pie"
          title="Medicine Categories"
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointment Booking */}
        <div>
          <AppointmentForm />
        </div>

        {/* Recent Appointments */}
        <div className="healthcare-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            Recent Appointments
          </h3>
          
          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appt) => (
                <div key={appt._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {appt.doctor?.name || "Doctor"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(appt.date).toLocaleDateString()} at {appt.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appt.status === "approved" ? "bg-green-100 text-green-800" :
                      appt.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Order History */}
      {orders && orders.length > 0 && (
        <div className="mt-8">
          <div className="healthcare-card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FaReceipt className="text-green-500 mr-2" />
              Recent Orders
            </h3>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Order #{order._id.slice(-8)}</h4>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Status: {order.status}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">${order.amount}</span>
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

export default UserDashboard;