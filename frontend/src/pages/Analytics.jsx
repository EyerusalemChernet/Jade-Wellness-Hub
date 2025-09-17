import { useApi } from "../hooks/useApi.js";
import { FaChartLine, FaUsers, FaUserMd, FaPills, FaCalendarAlt, FaTint, FaSpinner } from "react-icons/fa";

const Analytics = () => {
  const { useUsers, useDoctors, useMedicines, useAppointments, useBloodBank } = useApi();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: medicines, isLoading: loadingMedicines } = useMedicines();
  const { data: appointments, isLoading: loadingAppointments } = useAppointments();
  const { data: bloodBank, isLoading: loadingBloodBank } = useBloodBank();

  if (loadingUsers || loadingDoctors || loadingMedicines || loadingAppointments || loadingBloodBank) {
    return (
      <div className="container mx-auto py-10">
        <div className="healthcare-card p-8 text-center">
          <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: FaUsers,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Doctors",
      value: doctors?.length || 0,
      icon: FaUserMd,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Medicines",
      value: medicines?.length || 0,
      icon: FaPills,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Appointments",
      value: appointments?.length || 0,
      icon: FaCalendarAlt,
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    },
    {
      title: "Blood Donations",
      value: bloodBank?.length || 0,
      icon: FaTint,
      color: "text-red-500",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <FaChartLine className="text-green-500 mr-3" />
          Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600">Comprehensive overview of platform statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="healthcare-card p-6 text-center">
            <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <stat.icon className={`text-2xl ${stat.color}`} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="healthcare-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaUsers className="text-blue-500" />
                <span>New user registrations</span>
              </div>
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-orange-500" />
                <span>Appointments scheduled</span>
              </div>
              <span className="text-sm text-gray-500">This week</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaPills className="text-purple-500" />
                <span>Medicine orders</span>
              </div>
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="healthcare-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Service</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>File Storage</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Available</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API Response Time</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

