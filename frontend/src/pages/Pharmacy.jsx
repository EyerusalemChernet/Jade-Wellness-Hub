import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { toast } from "react-toastify";
import { FaPills, FaUpload, FaSpinner, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import api from "../utils/api.js";
import MedicineSearch from "../components/MedicineSearch.jsx";

const Pharmacy = () => {
	const { useMedicines } = useApi();
	const { data: medicines, isLoading } = useMedicines();
	const [selectedMedicines, setSelectedMedicines] = useState([]);
	const [orderForm, setOrderForm] = useState({
		deliveryAddress: "",
		deliveryDate: "",
		paymentMethod: "card",
		prescription: null,
		prescriptionUrl: ""
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddToCart = (medicine) => {
		setSelectedMedicines((prev) => {
			const existing = prev.find((item) => item._id === medicine._id || item.id === medicine.id);
			if (existing) {
				return prev.map((item) =>
					(item._id === medicine._id || item.id === medicine.id) ? { ...item, quantity: item.quantity + 1 } : item
				);
			}
			return [...prev, { ...medicine, quantity: 1 }];
		});
	};

	const handleMedicineSelect = (medicine) => {
		handleAddToCart(medicine);
	};

	const handleQuantityChange = (medicineId, quantity) => {
		setSelectedMedicines((prev) => prev.map((item) => (
			(item._id === medicineId || item.id === medicineId) ? { ...item, quantity } : item
		)));
	};

	const removeFromCart = (medicineId) => {
		setSelectedMedicines((prev) => prev.filter((item) => 
			item._id !== medicineId && item.id !== medicineId
		));
	};

	const checkPrescriptionRequired = () => {
		return selectedMedicines.some(medicine => 
			medicine.requiresPrescription || 
			(medicine.category && !['Pain Relief', 'Allergy', 'Cough & Cold', 'Sleep Aid', 'Digestive'].includes(medicine.category))
		);
	};

	const getTotalPrice = () => {
		return selectedMedicines.reduce((total, item) => total + (item.price * item.quantity), 0);
	};

	const handlePrescriptionUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		try {
			const formData = new FormData();
			formData.append("prescription", file);
			const res = await api.post("/api/uploads/prescriptions", formData, {
				headers: { "Content-Type": "multipart/form-data" }
			});
			setOrderForm({ ...orderForm, prescription: file, prescriptionUrl: res.data.url });
			toast.success("Prescription uploaded successfully");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to upload prescription");
		}
	};

	const handleOrderSubmit = async (e) => {
		e.preventDefault();
		if (selectedMedicines.length === 0) {
			toast.error("Please add medicines to your cart");
			return;
		}

		// Check if prescription is required but not provided
		if (checkPrescriptionRequired() && !orderForm.prescriptionUrl) {
			toast.error("Prescription is required for one or more medicines in your cart");
			return;
		}

		setIsSubmitting(true);
		try {
			const payload = {
				medicines: selectedMedicines.map(m => ({ 
					name: m.name, 
					quantity: m.quantity, 
					price: m.price,
					requiresPrescription: m.requiresPrescription || false
				})),
				totalAmount: getTotalPrice(),
				prescriptionUrl: orderForm.prescriptionUrl || undefined,
				deliveryAddress: orderForm.deliveryAddress,
				deliveryDate: orderForm.deliveryDate,
				paymentMethod: orderForm.paymentMethod === 'cod' ? 'cod' : 'card'
			};
			const { data: order } = await api.post("/api/orders", payload);
			if (orderForm.paymentMethod === 'card') {
				window.location.href = `/payments/${order._id}`;
				return;
			}
			toast.success("Order placed with Cash on Delivery. You'll be notified with updates.");
			setSelectedMedicines([]);
			setOrderForm({ deliveryAddress: "", deliveryDate: "", paymentMethod: "card", prescription: null, prescriptionUrl: "" });
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to place order");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-10">
				<div className="healthcare-card p-8 text-center">
					<FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
					<p className="text-gray-600">Loading pharmacy inventory...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
					<FaPills className="text-purple-500 mr-3" />
					Online Pharmacy
				</h1>
				<p className="text-xl text-gray-600">Order your prescribed medicines with home delivery</p>
			</div>

			{/* Medicine Search */}
			<div className="mb-8">
				<div className="healthcare-card p-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
						<FaSearch className="text-green-500 mr-3" />
						Search Medicines
					</h2>
					<MedicineSearch 
						onMedicineSelect={handleMedicineSelect}
						selectedMedicines={selectedMedicines}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Medicines list */}
				<div className="lg:col-span-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
						{medicines?.map((m) => (
							<div key={m._id} className="healthcare-card hover:shadow-lg transition-shadow duration-300">
								<div className="relative">
									{m.imageUrl ? (
										<img 
											src={m.imageUrl} 
											alt={m.name} 
											className="h-48 w-full object-cover rounded-t-xl"
											onError={(e) => {
												e.target.style.display = 'none';
												e.target.nextSibling.style.display = 'flex';
											}}
										/>
									) : null}
									<div 
										className={`h-48 w-full rounded-t-xl flex items-center justify-center ${m.imageUrl ? 'hidden' : 'flex'}`}
										style={{ 
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: 'white'
										}}
									>
										<FaPills className="text-4xl" />
									</div>
									{m.requiresPrescription && (
										<div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
											Rx Required
										</div>
									)}
								</div>
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">{m.name}</h3>
									<p className="text-sm text-gray-600 mb-3 line-clamp-2">{m.description || "No description available"}</p>
									<div className="flex items-center justify-between">
										<span className="text-xl font-bold text-green-600">{m.price} BIRR</span>
										<button 
											className="healthcare-btn-primary px-4 py-2 text-sm" 
											onClick={() => handleAddToCart(m)}
										>
											Add to Cart
										</button>
									</div>
									{m.category && (
										<div className="mt-2">
											<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
												{m.category}
											</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Cart and order */}
				<div>
					<div className="healthcare-card">
						<h3 className="text-xl font-semibold mb-4">Your Cart</h3>
						{selectedMedicines.length === 0 ? (
							<p className="text-gray-500">No items added yet. Use the search above to find medicines.</p>
						) : (
							<div className="space-y-3">
								{selectedMedicines.map((item) => (
									<div key={item._id || item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
										<div className="flex-1">
											<div className="flex items-center justify-between mb-1">
												<span className="font-medium">{item.name}</span>
												<button
													onClick={() => removeFromCart(item._id || item.id)}
													className="text-red-500 hover:text-red-700 text-sm"
												>
													Remove
												</button>
											</div>
											{item.requiresPrescription && (
												<div className="flex items-center text-xs text-red-600 mb-1">
													<FaExclamationTriangle className="mr-1" />
													Prescription Required
												</div>
											)}
											<div className="flex items-center space-x-2">
												<input 
													type="number" 
													min="1" 
													value={item.quantity} 
													onChange={(e) => handleQuantityChange(item._id || item.id, Number(e.target.value))} 
													className="w-16 healthcare-input text-sm" 
												/>
												<span className="font-medium">{(item.price * item.quantity).toFixed(2)} BIRR</span>
											</div>
										</div>
									</div>
								))}
								<div className="flex items-center justify-between border-t pt-3 mt-3">
									<span className="font-semibold">Total</span>
									<span className="font-bold text-lg">{getTotalPrice().toFixed(2)} BIRR</span>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
									<label className="flex items-center space-x-2 p-3 border rounded-lg">
										<input type="radio" name="payment" checked={orderForm.paymentMethod === 'card'} onChange={() => setOrderForm({...orderForm, paymentMethod: 'card'})} />
										<span>Pay Online (Stripe)</span>
									</label>
									<label className="flex items-center space-x-2 p-3 border rounded-lg">
										<input type="radio" name="payment" checked={orderForm.paymentMethod === 'cod'} onChange={() => setOrderForm({...orderForm, paymentMethod: 'cod'})} />
										<span>Cash on Delivery</span>
									</label>
								</div>
								{checkPrescriptionRequired() && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
										<div className="flex items-center text-yellow-800">
											<FaExclamationTriangle className="mr-2" />
											<span className="text-sm font-medium">Prescription Required</span>
										</div>
										<p className="text-xs text-yellow-700 mt-1">
											One or more medicines in your cart require a prescription. Please upload it below.
										</p>
									</div>
								)}
							</div>
						)}
					</div>

					<form onSubmit={handleOrderSubmit} className="healthcare-card mt-6 space-y-4">
						<div>
							<label className="healthcare-label">Delivery Address *</label>
							<textarea
								value={orderForm.deliveryAddress}
								onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
								className="healthcare-input"
								rows="3"
								placeholder="Enter your complete delivery address"
								required
							/>
						</div>
						<div>
							<label className="healthcare-label">Preferred Delivery Date</label>
							<input
								type="date"
								value={orderForm.deliveryDate}
								onChange={(e) => setOrderForm({...orderForm, deliveryDate: e.target.value})}
								className="healthcare-input"
								min={new Date().toISOString().split('T')[0]}
							/>
						</div>
						<div>
							<label className="healthcare-label">
								Upload Prescription {checkPrescriptionRequired() ? "*" : "(Optional)"}
							</label>
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
								<FaUpload className="text-2xl text-gray-400 mx-auto mb-2" />
								<input type="file" accept="image/*,.pdf" onChange={handlePrescriptionUpload} className="hidden" id="prescription-upload" />
								<label htmlFor="prescription-upload" className="cursor-pointer text-sm text-gray-600">
									Click to upload prescription
								</label>
								{orderForm.prescription && (
									<p className="text-sm text-green-600 mt-2">{orderForm.prescription.name} uploaded</p>
								)}
							</div>
							{checkPrescriptionRequired() && !orderForm.prescriptionUrl && (
								<p className="text-xs text-red-600 mt-1">
									Prescription is required for medicines in your cart
								</p>
							)}
						</div>
						<button 
							type="submit" 
							disabled={isSubmitting || selectedMedicines.length === 0 || !orderForm.deliveryAddress} 
							className="healthcare-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Placing Order..." : "Place Order"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Pharmacy;
