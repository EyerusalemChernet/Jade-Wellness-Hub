import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api.js";

const MedicineForm = () => {
  const { useAddMedicine } = useApi();
  const { mutate: addMedicine, isPending: isAdding } = useAddMedicine();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("prescription", file);
      const res = await api.post("/api/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.url;
    } catch (error) {
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = "";
      if (imageFile) {
        setIsUploading(true);
        imageUrl = await handleFileUpload(imageFile);
        setIsUploading(false);
      }

      addMedicine({ 
        ...formData, 
        price: parseFloat(formData.price), 
        stock: parseInt(formData.stock),
        imageUrl 
      });
      
      // Reset form
      setFormData({ name: "", price: "", stock: "", description: "" });
      setImageFile(null);
    } catch (error) {
      setIsUploading(false);
      toast.error("Failed to add medicine");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="healthcare-card p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Medicine</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="healthcare-label">Medicine Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter medicine name"
              className="healthcare-input"
              required
            />
          </div>
          <div>
            <label className="healthcare-label">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="healthcare-input"
              required
            />
          </div>
          <div>
            <label className="healthcare-label">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="healthcare-input"
              required
            />
          </div>
          <div>
            <label className="healthcare-label">Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Medicine description"
              className="healthcare-input"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="healthcare-label">Medicine Image (Optional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="medicine-image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span>Upload an image</span>
                  <input
                    id="medicine-image"
                    name="medicine-image"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              {imageFile && (
                <p className="text-sm text-green-600">Selected: {imageFile.name}</p>
              )}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isAdding || isUploading}
          className="healthcare-btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding || isUploading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>{isUploading ? "Uploading..." : "Adding Medicine..."}</span>
            </>
          ) : (
            "Add Medicine"
          )}
        </button>
      </form>
    </div>
  );
};

export default MedicineForm;