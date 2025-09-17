import { useState, useMemo } from "react";
import { useApi } from "../hooks/useApi.js";
import { toast } from "react-toastify";
import { FaCreditCard, FaSpinner, FaCheck, FaReceipt, FaDownload, FaCalendarAlt, FaUser, FaDollarSign, FaShieldAlt } from "react-icons/fa";
import PaymentForm from "../components/PaymentForm.jsx";
import { useParams } from "react-router-dom";

const Payments = () => {
  const { useOrders, useOrder, useProfile } = useApi();
  const { data: orders, isLoading: loadingOrders } = useOrders();
  const { data: profile } = useProfile();
  const [activeTab, setActiveTab] = useState("history");
  const { orderId } = useParams();
  const { data: selectedOrder } = useOrder(orderId);

  if (loadingOrders) {
    return (
      <div className="container mx-auto py-10">
        <div className="healthcare-card p-8 text-center">
          <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <FaCreditCard className="text-green-500 mr-3" />
          Payments & Billing
        </h1>
        <p className="text-xl text-gray-600">Manage your payments and view billing history</p>
      </div>

      {orderId && selectedOrder && selectedOrder.status !== 'paid' && (
        <div className="healthcare-card p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pay for Order #{selectedOrder._id.slice(-8)}</h3>
          <PaymentForm orderId={selectedOrder._id} amount={selectedOrder.totalAmount} />
        </div>
      )}

      <div className="healthcare-card p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h3>
        
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Order #{order._id.slice(-8)}</h4>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                    <p className="text-sm text-gray-600">Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe'}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">{order.totalAmount} BIRR</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600">You haven't made any payments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;