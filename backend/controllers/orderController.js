import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";
import { sendEmail, orderConfirmationTemplate } from "../utils/emailService.js";

export const createOrder = async (req, res, next) => {
	try {
		const { medicines, totalAmount, prescriptionUrl, deliveryAddress, deliveryDate, paymentMethod } = req.body;
		if (!medicines || !medicines.length || !totalAmount) {
			return res.status(400).json({ message: "Please provide medicines and totalAmount" });
		}

		// Check if prescription is required for any medicine
		const requiresPrescription = medicines.some(med => med.requiresPrescription);
		if (requiresPrescription && !prescriptionUrl) {
			return res.status(400).json({ message: "Prescription is required for one or more medicines" });
		}

		let calculatedTotal = 0;
		for (const item of medicines) {
			if (!item.name || !item.quantity || !item.price) {
				return res.status(400).json({ message: "Each medicine must have name, quantity, and price" });
			}
			calculatedTotal += item.quantity * item.price;
		}
		if (calculatedTotal !== totalAmount) {
			return res.status(400).json({ message: "Total amount does not match calculated total" });
		}
		
		const order = await Order.create({
			user: req.user._id,
			medicines,
			totalAmount,
			paymentMethod: paymentMethod === 'cod' ? 'cod' : 'card',
			prescriptionUrl,
			deliveryAddress,
			deliveryDate,
			status: paymentMethod === 'cod' ? 'pending_cod' : 'pending'
		});
		console.log("Order created:", { id: order._id, user: req.user._id, paymentMethod });

		// If COD, mark as confirmed for shipment step (optional biz logic)
		if (paymentMethod === 'cod') {
			// keep as pending but notify user; payment upon delivery
		}

		// Send confirmation email
		try {
			await sendEmail(req.user.email, "Order Confirmation", orderConfirmationTemplate(req.user.name, { medicines, totalAmount }));
		} catch (emailError) {
			console.error("Order confirmation email failed:", emailError.message);
		}

		res.status(201).json(order);
	} catch (error) {
		console.error("Create order error:", error);
		next(error);
	}
};

export const getAllOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({}).populate({
			path: "user",
			select: "name email role"
		});
		console.log("Fetched all orders:", { count: orders.length });
		res.json(orders);
	} catch (error) {
		console.error("Get all orders error:", error);
		next(error);
	}
};

export const updateOrder = async (req, res, next) => {
	try {
		const { medicines, totalAmount, status } = req.body;
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}
		if (medicines) {
			let calculatedTotal = 0;
			for (const item of medicines) {
				if (!item.name || !item.quantity || !item.price) {
					return res.status(400).json({ message: "Each medicine must have name, quantity, and price" });
				}
				const medicine = await Medicine.findOne({ name: item.name });
				if (!medicine) {
					return res.status(404).json({ message: `Medicine ${item.name} not found` });
				}
				if (medicine.stock < item.quantity) {
					return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
				}
				calculatedTotal += item.quantity * item.price;
			}
			order.medicines = medicines;
			order.totalAmount = totalAmount || calculatedTotal;
		}
		order.status = status || order.status;
		await order.save();
		res.json(order);
	} catch (error) {
		console.error("Update order error:", error);
		next(error);
	}
};

export const deleteOrder = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}
		await order.deleteOne();
		res.json({ message: "Order deleted" });
	} catch (error) {
		console.error("Delete order error:", error);
		next(error);
	}
};