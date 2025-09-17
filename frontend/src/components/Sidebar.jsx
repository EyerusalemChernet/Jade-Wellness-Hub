import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  FaUser, FaTint, FaCreditCard, FaHome, 
  FaUserMd, FaPills, FaUsers, FaTimes, FaCog,
  FaBell, FaChartLine, FaCalendarAlt, FaFileMedical
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      path: "/profile", 
      label: "Profile", 
      icon: FaUser, 
      accessibleTo: ["user", "doctor", "admin"],
      description: "Manage your profile"
    },
    { 
      path: "/blood-bank", 
      label: "Blood Bank", 
      icon: FaTint, 
      accessibleTo: ["user", "admin"],
      description: "Blood donations & requests"
    },
    { 
      path: "/payments", 
      label: "Payments", 
      icon: FaCreditCard, 
      accessibleTo: ["user"],
      description: "Payment history & billing"
    },
    { 
      path: "/appointments", 
      label: "Appointments", 
      icon: FaCalendarAlt, 
      accessibleTo: ["user", "doctor"],
      description: "Schedule & manage appointments"
    },
    { 
      path: "/medical-records", 
      label: "Medical Records", 
      icon: FaFileMedical, 
      accessibleTo: ["user", "doctor"],
      description: "View health records"
    },
    { 
      path: "/analytics", 
      label: "Analytics", 
      icon: FaChartLine, 
      accessibleTo: ["admin", "doctor"],
      description: "Reports & insights"
    },
  ];

  const dashboardItems = [
    { 
      path: "/user-dashboard", 
      label: "User Dashboard", 
      icon: FaHome, 
      role: "user",
      description: "Your health overview"
    },
    { 
      path: "/doctor-dashboard", 
      label: "Doctor Dashboard", 
      icon: FaUserMd, 
      role: "doctor",
      description: "Patient management"
    },
    { 
      path: "/admin-dashboard", 
      label: "Admin Dashboard", 
      icon: FaUsers, 
      role: "admin",
      description: "System administration"
    },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin": return "Administrator";
      case "doctor": return "Doctor";
      case "user": return "Patient";
      default: return "User";
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 healthcare-gradient text-white z-40 transform transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">J</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Jade Wellness</h2>
                <p className="text-xs text-green-100">Healthcare Hub</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-green-100">{getRoleDisplayName(user.role)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Dashboard Section */}
            {user && (
              <div className="mb-8">
                <h3 className="text-green-200 text-xs uppercase font-semibold mb-3 tracking-wider">
                  Dashboard
                </h3>
                <ul className="space-y-1">
                  {dashboardItems.map((item) => (
                    user?.role === item.role && (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                            isActive(item.path)
                              ? "bg-white/20 text-white shadow-lg"
                              : "text-green-100 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActive(item.path) 
                              ? "bg-white/20" 
                              : "bg-white/10 group-hover:bg-white/20"
                          }`}>
                            <item.icon className="text-sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-green-200 opacity-80 truncate">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}

            {/* Main Menu Section */}
            <div>
              <h3 className="text-green-200 text-xs uppercase font-semibold mb-3 tracking-wider">
                Services
              </h3>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  item.accessibleTo.includes(user?.role) && (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive(item.path)
                            ? "bg-white/20 text-white shadow-lg"
                            : "text-green-100 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive(item.path) 
                            ? "bg-white/20" 
                            : "bg-white/10 group-hover:bg-white/20"
                        }`}>
                          <item.icon className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-green-200 opacity-80 truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="space-y-2">
            <Link
              to="/notifications"
              className="flex items-center space-x-3 p-2 text-green-100 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaBell className="text-sm" />
              <span className="text-sm">Notifications</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 p-2 text-green-100 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaCog className="text-sm" />
              <span className="text-sm">Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;