import { useApi } from "../hooks/useApi.js";
import Sidebar from "../components/Sidebar.jsx";
import DoctorForm from "../components/DoctorForm.jsx";
import MedicineForm from "../components/MedicineForm.jsx";
import DashboardChart from "../components/DashboardChart.jsx";

const AdminDashboard = () => {
  const { useUsers, useDoctors, useMedicines } = useApi();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: medicines, isLoading: loadingMedicines } = useMedicines();

  if (loadingUsers || loadingDoctors || loadingMedicines) return <div>Loading...</div>;

  // Prepare chart data
  const userGrowthData = [
    { name: 'Jan', value: Math.floor((users?.length || 0) * 0.2) },
    { name: 'Feb', value: Math.floor((users?.length || 0) * 0.4) },
    { name: 'Mar', value: Math.floor((users?.length || 0) * 0.6) },
    { name: 'Apr', value: Math.floor((users?.length || 0) * 0.8) },
    { name: 'May', value: users?.length || 0 }
  ];

  const doctorSpecialtyData = doctors?.reduce((acc, doctor) => {
    const specialty = doctor.specialty || 'General';
    const existing = acc.find(item => item.name === specialty);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: specialty, value: 1 });
    }
    return acc;
  }, []) || [];

  const medicineStockData = medicines?.map(medicine => ({
    name: medicine.name,
    value: medicine.stock || 0
  })).slice(0, 5) || [];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <DashboardChart
            data={userGrowthData}
            type="line"
            title="User Growth"
            height={250}
          />
          <DashboardChart
            data={doctorSpecialtyData}
            type="pie"
            title="Doctor Specialties"
            height={250}
          />
          <DashboardChart
            data={medicineStockData}
            type="bar"
            title="Medicine Stock Levels"
            height={250}
          />
        </div>
        <h3 className="text-xl font-bold mb-4">Users</h3>
        <ul>
          {users?.map((u) => (
            <li key={u._id} className="border p-2 mb-2">
              Name: {u.name} - Email: {u.email}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mb-4 mt-8">Add Doctor</h3>
        <DoctorForm />
        <h3 className="text-xl font-bold mb-4 mt-8">Doctors</h3>
        <ul>
          {doctors?.map((d) => (
            <li key={d._id} className="border p-2 mb-2">
              Name: {d.name} - Specialty: {d.specialty}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mb-4 mt-8">Add Medicine</h3>
        <MedicineForm />
        <h3 className="text-xl font-bold mb-4 mt-8">Medicines</h3>
        <ul>
          {medicines?.map((m) => (
            <li key={m._id} className="border p-2 mb-2">
              Name: {m.name} - Price: ${m.price} - Stock: {m.stock}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;