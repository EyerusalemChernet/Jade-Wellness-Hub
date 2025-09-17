import AppointmentForm from "../components/AppointmentForm.jsx";
import { FaCalendarAlt } from "react-icons/fa";

const Appointments = () => {
	return (
		<div className="container mx-auto py-10">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
					<FaCalendarAlt className="text-green-500 mr-3" />
					Book an Appointment
				</h1>
				<p className="text-xl text-gray-600">Schedule a visit with our qualified doctors</p>
			</div>

			<div className="max-w-3xl mx-auto">
				<AppointmentForm />
			</div>
		</div>
	);
};

export default Appointments;
