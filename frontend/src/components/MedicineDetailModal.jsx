import { useState } from "react";
import { FaTimes, FaPills, FaShoppingCart, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const MedicineDetailModal = ({ medicine, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !medicine) return null;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({ ...medicine, quantity });
    toast.success(`${medicine.name} added to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaPills className="text-purple-500 mr-3" />
              {medicine.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Medicine Image */}
          <div className="mb-6">
            <img
              src={medicine.imageUrl}
              alt={medicine.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Medicine Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Price:</span>
              <span className="text-2xl font-bold text-green-600">{medicine.price} BIRR</span>
            </div>

            <div>
              <span className="text-lg font-semibold text-gray-900">Description:</span>
              <p className="text-gray-600 mt-1">{medicine.description}</p>
            </div>

            <div>
              <span className="text-lg font-semibold text-gray-900">Category:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ml-2">
                {medicine.category}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">Prescription Required:</span>
              {medicine.requiresPrescription ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 ml-2">
                  <FaExclamationTriangle className="w-3 h-3 mr-1" />
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ml-2">
                  <FaCheckCircle className="w-3 h-3 mr-1" />
                  No
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">{(medicine.price * quantity).toFixed(2)} BIRR</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailModal;
