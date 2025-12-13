import React, { useState, useRef } from 'react';
import { FoodItem } from '../types';
import { analyzeFoodImage } from '../services/geminiService';
import { Upload, Loader2, MapPin, Package, Phone, Image as ImageIcon } from 'lucide-react';

interface DonorPanelProps {
  items: FoodItem[];
  onAddItem: (item: FoodItem) => void;
}

const DonorPanel: React.FC<DonorPanelProps> = ({ items, onAddItem }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    donorName: '',
    contact: '',
    location: '',
    title: '',
    description: '',
    quantity: '',
    image: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for display and API
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64String }));
      
      // Call Gemini API
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeFoodImage(base64String);
        setFormData(prev => ({
          ...prev,
          title: analysis.title,
          description: analysis.description,
          quantity: analysis.quantityEstimation
        }));
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: FoodItem = {
      id: Date.now().toString(),
      ...formData,
      status: 'available',
      createdAt: Date.now(),
    };
    onAddItem(newItem);
    // Reset essential form fields
    setFormData(prev => ({
      ...prev,
      title: '',
      description: '',
      quantity: '',
      image: '',
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Donation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="text-brand-600" />
              Donate Food
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Area */}
              <div 
                className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-brand-400 bg-gray-50 hover:bg-brand-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                
                {formData.image ? (
                  <div className="relative">
                    <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-brand-500 mb-2">
                      {isAnalyzing ? <Loader2 className="animate-spin h-full w-full" /> : <Upload className="h-full w-full" />}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {isAnalyzing ? "Analyzing food..." : "Upload food photo"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">AI will auto-fill details</p>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Sourdough Bread"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the food quality and contents..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g. 5kg"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name</label>
                  <input
                    type="text"
                    name="donorName"
                    required
                    value={formData.donorName}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="contact"
                      required
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Phone/Email"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                   <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City/Address"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !formData.image}
                className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Post Donation
              </button>
            </form>
          </div>
        </div>

        {/* My Donations List */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Active Donations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-brand-700 shadow-sm">
                    {item.status}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                     <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span>{item.quantity}</span>
                    </div>
                     <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500">No active donations yet. Be the first to donate!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPanel;
