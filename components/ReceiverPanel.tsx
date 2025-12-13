import React, { useState } from 'react';
import { FoodItem, FoodRequest } from '../types';
import { Search, MapPin, Phone, Package, Navigation, Send } from 'lucide-react';

interface ReceiverPanelProps {
  items: FoodItem[];
  onRequestItem: (request: FoodRequest) => void;
}

const ReceiverPanel: React.FC<ReceiverPanelProps> = ({ items, onRequestItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customRequest, setCustomRequest] = useState('');
  const [customQuantity, setCustomQuantity] = useState('');
  
  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest || !customQuantity) return;
    
    onRequestItem({
      id: Date.now().toString(),
      receiverName: 'Current User', // In a real app, from auth
      contact: '555-0000',
      itemRequested: customRequest,
      quantity: customQuantity,
      status: 'pending',
      createdAt: Date.now()
    });

    setCustomRequest('');
    setCustomQuantity('');
    alert("Your request has been broadcasted to nearby donors!");
  };

  const handleApply = (item: FoodItem) => {
    alert(`Applied for ${item.title}. The donor (${item.contact}) has been notified.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Section: Search and Custom Request */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for food, location, or donor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="md:w-1/3 bg-blue-50 rounded-xl p-1 border border-blue-100 flex items-center">
             <div className="px-4 text-xs font-semibold text-blue-700 uppercase tracking-wider hidden xl:block">
               Can't find?
             </div>
             <form onSubmit={handleCustomRequest} className="flex-grow flex gap-2 p-1">
                <input 
                  value={customRequest}
                  onChange={e => setCustomRequest(e.target.value)}
                  placeholder="Request Item..."
                  className="flex-grow bg-white border-0 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
                 <input 
                  value={customQuantity}
                  onChange={e => setCustomQuantity(e.target.value)}
                  placeholder="Qty"
                  className="w-16 bg-white border-0 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Send size={16} />
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* Grid of Food Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Image Header */}
            <div className="relative h-56">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm opacity-90">{item.donorName}</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-grow flex flex-col space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900 mr-1">Qty:</span> {item.quantity}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span>{item.contact}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-6 flex gap-3">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <Navigation size={18} />
                  Map
                </a>
                <button 
                  onClick={() => handleApply(item)}
                  className="flex-[2] py-2.5 px-4 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 shadow-md shadow-brand-200 transition-colors"
                >
                  Apply for Food
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-20">
             <div className="bg-gray-50 inline-block p-6 rounded-full mb-4">
               <Search className="h-10 w-10 text-gray-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No food items found</h3>
             <p className="text-gray-500 mt-1">Try adjusting your search terms or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverPanel;
