import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Suspense, lazy, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react"; // Added SpeedInsights import

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.jsx"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const BloodBank = lazy(() => import("./pages/BloodBank.jsx"));
const Pharmacy = lazy(() => import("./pages/Pharmacy.jsx"));
const MedicalRecords = lazy(() => import("./pages/MedicalRecords.jsx"));
const Payments = lazy(() => import("./pages/Payments.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Team = lazy(() => import("./pages/Team.jsx"));
const Help = lazy(() => import("./pages/Help.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const ScrollToTop = () => {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
	}, [pathname]);
	return null;
};

function AppContent() {
	const { user } = useAuth();

	// Redirect to appropriate dashboard based on user role
	const getDashboardRoute = () => {
		if (!user) return <Navigate to="/login" />;
		
		switch (user.role) {
			case 'admin':
				return <Navigate to="/admin-dashboard" />;
			case 'doctor':
				return <Navigate to="/doctor-dashboard" />;
			case 'user':
			default:
				return <Navigate to="/user-dashboard" />;
		}
	};

	return (
		<Router>
			<ScrollToTop />
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
				<Header />
				
				<main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto healthcare-fade-in">
					<div className="max-w-7xl mx-auto">
						<Suspense fallback={<LoadingSpinner />}>
							<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route 
								path="/user-dashboard" 
								element={<PrivateRoute component={UserDashboard} role="user" />} 
							/>
							<Route 
								path="/doctor-dashboard" 
								element={<PrivateRoute component={DoctorDashboard} role="doctor" />} 
							/>
							<Route 
								path="/admin-dashboard" 
								element={<PrivateRoute component={AdminDashboard} role="admin" />} 
							/>
							<Route path="/appointments" element={<PrivateRoute component={Appointments} />} />
							<Route path="/blood-bank" element={<PrivateRoute component={BloodBank} />} />
							<Route path="/pharmacy" element={<PrivateRoute component={Pharmacy} />} />
							<Route path="/medical-records" element={<PrivateRoute component={MedicalRecords} />} />
							<Route path="/payments" element={<PrivateRoute component={Payments} />} />
							<Route path="/payments/:orderId" element={<PrivateRoute component={Payments} />} />
							<Route path="/profile" element={<PrivateRoute component={Profile} />} />
							<Route path="/about" element={<About />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/team" element={<Team />} />
							<Route path="/help" element={<Help />} />
							<Route path="/careers" element={<Careers />} />
							<Route path="/privacy" element={<Privacy />} />
							<Route path="/terms" element={<Terms />} />
							<Route path="/faq" element={<FAQ />} />
							<Route path="/analytics" element={<PrivateRoute component={Analytics} />} />
							<Route path="/settings" element={<PrivateRoute component={Settings} />} />
							<Route path="*" element={<Navigate to="/" />} />
							</Routes>
						</Suspense>
					</div>
				</main>
				
				<Footer />
				<Chatbot />
				<SpeedInsights /> {/* Added SpeedInsights component */}
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
					toastClassName="healthcare-card"
					progressClassName="healthcare-gradient"
				/>
			</div>
		</Router>
	);
}

const PrivateRoute = ({ component: Component, role }) => {
	const { user } = useAuth();
	return user && (!role || user.role === role) ? <Component /> : <Navigate to="/login" />;
};

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Elements stripe={stripePromise}>
					<AppContent />
				</Elements>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;