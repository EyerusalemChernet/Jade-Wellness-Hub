import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  FaSignOutAlt, FaUser, FaBars, FaTimes, FaBell, FaCog, 
  FaHome, FaUserMd, FaUsers, FaTint, FaCreditCard, FaCalendarAlt, 
  FaFileMedical, FaChartLine, FaPills
} from "react-icons/fa";
import { useState } from "react";
import Notification from "./Notification.jsx";
import logo from "../assets/jade/jade-icon.png";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin-dashboard";
      case "doctor": return "/doctor-dashboard";
      case "user": return "/user-dashboard";
      default: return "/";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin": return "Administrator";
      case "doctor": return "Doctor";
      case "user": return "Patient";
      default: return "User";
    }
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: FaHome, 
      accessibleTo: ["all"] 
    },
    { 
      path: getDashboardPath(), 
      label: "Dashboard", 
      icon: user?.role === "admin" ? FaUsers : user?.role === "doctor" ? FaUserMd : FaHome, 
      accessibleTo: ["user", "doctor", "admin"] 
    },
    { 
      path: "/appointments", 
      label: "Appointments", 
      icon: FaCalendarAlt, 
      accessibleTo: ["user", "doctor"] 
    },
    { 
      path: "/blood-bank", 
      label: "Blood Bank", 
      icon: FaTint, 
      accessibleTo: ["user", "admin"] 
    },
    { 
      path: "/pharmacy", 
      label: "Pharmacy", 
      icon: FaPills, 
      accessibleTo: ["user"] 
    },
    { 
      path: "/medical-records", 
      label: "Records", 
      icon: FaFileMedical, 
      accessibleTo: ["user", "doctor"] 
    },
    { 
      path: "/payments", 
      label: "Payments", 
      icon: FaCreditCard, 
      accessibleTo: ["user"] 
    },
    { 
      path: "/analytics", 
      label: "Analytics", 
      icon: FaChartLine, 
      accessibleTo: ["admin", "doctor"] 
    }
  ];

  const getVisibleNavItems = () => {
    if (!user) return navigationItems.filter(item => item.accessibleTo.includes("all"));
    return navigationItems.filter(item => 
      item.accessibleTo.includes("all") || 
      item.accessibleTo.includes(user.role)
    );
  };

  return (
    <header className="healthcare-gradient shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 overflow-hidden">
              <img src={logo} alt="Jade Wellness Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white font-heading">Jade Wellness</h1>
              <p className="text-xs text-green-100">Healthcare Hub</p>
            </div>
          </Link>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="text-white">
                  <Notification />
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <FaUser className="text-green-600 text-sm" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-green-100">{getRoleDisplayName(user.role)}</p>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <FaUser className="text-gray-400" />
                          <span>Profile Settings</span>
                        </Link>
                        <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700">
                          <FaBell className="text-gray-400" />
                          <span>Notifications</span>
                          <div className="ml-auto">
                            <Notification />
                          </div>
                        </div>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <FaCog className="text-gray-400" />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <FaSignOutAlt />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="healthcare-nav-link text-white hover:text-green-100 hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="healthcare-btn-primary bg-white text-green-600 hover:bg-green-50"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Main Navigation Bar */}
        {user && (
          <div className="hidden lg:block border-t border-white/20">
            <div className="flex items-center space-x-1 py-2">
              {getVisibleNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-green-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="text-sm" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4">
            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-green-100">{getRoleDisplayName(user.role)}</p>
                  </div>
                </div>
                
                {/* Navigation Items */}
                <div className="grid grid-cols-2 gap-2">
                  {getVisibleNavItems().map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 p-3 rounded-xl transition-colors ${
                        isActive(item.path)
                          ? "bg-white/20 text-white"
                          : "text-green-100 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="text-sm" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Logout */}
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 p-3 text-red-200 hover:bg-red-500/20 rounded-xl transition-colors w-full text-left"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="block p-3 text-white hover:bg-white/10 rounded-xl transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block p-3 bg-white text-green-600 hover:bg-green-50 rounded-xl transition-colors text-center font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;