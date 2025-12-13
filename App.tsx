import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DonorPanel from './components/DonorPanel';
import ReceiverPanel from './components/ReceiverPanel';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { INITIAL_FOOD_ITEMS } from './constants';
import { FoodItem, FoodRequest, UserRole } from './types';

interface User {
  name: string;
  role: UserRole;
}

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [requests, setRequests] = useState<FoodRequest[]>([]);

  const handleEnter = () => {
    setHasEntered(true);
  };

  const handleLogin = (name: string, role: UserRole) => {
    setUser({ name, role });
  };

  const handleLogout = () => {
    setUser(null);
    setHasEntered(false); // Optional: go back to landing on logout? Or just login. Let's go to Login.
    // If you want to go to landing: setHasEntered(false);
  };

  const handleAddItem = (item: FoodItem) => {
    const itemWithUser = { ...item, donorName: user?.name || item.donorName };
    setFoodItems(prev => [itemWithUser, ...prev]);
  };

  const handleRequestItem = (request: FoodRequest) => {
    const reqWithUser = { ...request, receiverName: user?.name || request.receiverName };
    setRequests(prev => [reqWithUser, ...prev]);
    console.log("New Request Logged:", reqWithUser);
  };

  // 1. Landing Page
  if (!hasEntered) {
    return <LandingPage onEnter={handleEnter} />;
  }

  // 2. Login Page
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 3. Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-brand-volt selection:text-black">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="animate-fade-in-up">
        {user.role === 'donor' ? (
          <DonorPanel items={foodItems} onAddItem={handleAddItem} />
        ) : (
          <ReceiverPanel items={foodItems} onRequestItem={handleRequestItem} />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-100 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-2xl font-black tracking-tighter mb-4">VITAL</h2>
          <p className="text-gray-400 text-sm font-medium tracking-wide">SUSTAINABLE NUTRITION INFRASTRUCTURE</p>
          <p className="text-gray-300 text-xs mt-8">© {new Date().getFullYear()} VITAL PLATFORM.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;