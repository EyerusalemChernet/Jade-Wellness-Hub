import { useState, useEffect, useRef } from "react";
import { FaSearch, FaPills, FaTimes, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import MedicineDetailModal from "./MedicineDetailModal.jsx";
import Paracetamol from "../assets/medicine/Paracetamol.jpg";
import Ibuprofen from "../assets/medicine/Ibuprofen.jpg";
import Aspirin from "../assets/medicine/Aspirin.jpg";
import Atorvastatin from "../assets/medicine/Atorvastatin.jpg";
import Cetirizine from "../assets/medicine/Cetirizine.jpg";
import Dextromethorphan from "../assets/medicine/Dextromethorphan.jpg";
import Diphenhydramine from "../assets/medicine/Diphenhydramine.jpg";
import Guaifenesin from "../assets/medicine/Guaifenesin.jpg";
import Lisinopril from "../assets/medicine/Lisinopril.jpg";
import Loratadine from "../assets/medicine/Loratadine.jpg";
import Melatonin from "../assets/medicine/Melatonin.jpg";
import Metformin from "../assets/medicine/Metformin.jpg";
import Omeprazole from "../assets/medicine/Omeprazole.jpg";
import Ciprofloxacin from "../assets/medicine/Ciprofloxacin.jpg";
import Amoxicillin from "../assets/medicine/Amoxicillin.jpg";


const MedicineSearch = ({ onMedicineSelect, selectedMedicines = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Common medicines database (in a real app, this would come from an API)
  const medicinesDatabase = [
    { id: 1, name: "Paracetamol", description: "Pain reliever and fever reducer", price: 25.50, imageUrl: Paracetamol, requiresPrescription: false, category: "Pain Relief" },
    { id: 2, name: "Ibuprofen", description: "Anti-inflammatory pain reliever", price: 35.00, imageUrl: Ibuprofen, requiresPrescription: false, category: "Pain Relief" },
    { id: 3, name: "Aspirin", description: "Pain reliever and blood thinner", price: 20.00, imageUrl: Aspirin, requiresPrescription: false, category: "Pain Relief" },
    { id: 4, name: "Amoxicillin", description: "Antibiotic for bacterial infections", price: 55.00, imageUrl: Amoxicillin, requiresPrescription: true, category: "Antibiotics" },
    { id: 5, name: "Ciprofloxacin", description: "Broad-spectrum antibiotic", price: 68.00, imageUrl: Ciprofloxacin, requiresPrescription: true, category: "Antibiotics" },
    { id: 6, name: "Metformin", description: "Diabetes medication", price: 38.50, imageUrl: Metformin, requiresPrescription: true, category: "Diabetes" },
    { id: 7, name: "Lisinopril", description: "Blood pressure medication", price: 42.50, imageUrl: Lisinopril, requiresPrescription: true, category: "Cardiovascular" },
    { id: 8, name: "Atorvastatin", description: "Cholesterol medication", price: 51.00, imageUrl: Atorvastatin, requiresPrescription: true, category: "Cardiovascular" },
    { id: 9, name: "Omeprazole", description: "Acid reflux medication", price: 30.00, imageUrl: Omeprazole, requiresPrescription: false, category: "Digestive" },
    { id: 10, name: "Cetirizine", description: "Antihistamine for allergies", price: 25.50, imageUrl: Cetirizine, requiresPrescription: false, category: "Allergy" },
    { id: 11, name: "Loratadine", description: "Non-drowsy antihistamine", price: 30.00, imageUrl: Loratadine, requiresPrescription: false, category: "Allergy" },
    { id: 12, name: "Dextromethorphan", description: "Cough suppressant", price: 21.50, imageUrl: Dextromethorphan, requiresPrescription: false, category: "Cough & Cold" },
    { id: 13, name: "Guaifenesin", description: "Expectorant for chest congestion", price: 25.50, imageUrl: Guaifenesin, requiresPrescription: false, category: "Cough & Cold" },
    { id: 14, name: "Diphenhydramine", description: "Antihistamine and sleep aid", price: 21.50, imageUrl: Diphenhydramine, requiresPrescription: false, category: "Sleep Aid" },
    { id: 15, name: "Melatonin", description: "Natural sleep aid", price: 34.00, imageUrl: Melatonin, requiresPrescription: false, category: "Sleep Aid" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = medicinesDatabase.filter(medicine =>
        medicine.name.toLowerCase().includes(term.toLowerCase()) ||
        medicine.description.toLowerCase().includes(term.toLowerCase()) ||
        medicine.category.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 8); // Limit to 8 results

      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 300);
  };

  const handleMedicineClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailModal(true);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleAddToCart = (medicine) => {
    // Check if medicine is already selected
    const isAlreadySelected = selectedMedicines.some(selected => selected.id === medicine.id);
    if (isAlreadySelected) {
      toast.warning("This medicine is already in your cart");
      return;
    }

    onMedicineSelect(medicine);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          className="healthcare-input pl-10 pr-10 w-full"
          placeholder="Search medicines by name, description, or category..."
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <FaSearch className="animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-12 h-12 mr-3">
                    <img
                      src={medicine.imageUrl}
                      alt={medicine.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {medicine.name}
                      </h4>
                      <span className="text-sm font-bold text-green-600">
                        {medicine.price} BIRR
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {medicine.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {medicine.category}
                        </span>
                        {medicine.requiresPrescription && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <FaPills className="w-3 h-3 mr-1" />
                            Prescription Required
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleMedicineClick(medicine)}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      >
                        <FaEye className="w-3 h-3 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showResults && searchResults.length === 0 && !isSearching && searchTerm.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No medicines found matching "{searchTerm}"
        </div>
      )}

      {/* Medicine Detail Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default MedicineSearch;


