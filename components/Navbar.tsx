import React from 'react';
import { UserRole } from '../types';
import { Utensils, HeartHandshake, Circle, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: { name: string; role: UserRole };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter text-black">VITAL</span>
              <div className="w-2 h-2 bg-brand-volt rounded-full"></div>
            </div>
            <div className="hidden md:flex ml-8 items-center space-x-2 text-xs font-semibold tracking-wide uppercase text-gray-400 border-l pl-6 border-gray-200">
               <span className="flex items-center gap-1.5">
                 {user.role === 'donor' ? 'Donor Mode' : 'Receiver Mode'}
               </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center">
                <span className="font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block tracking-tight">{user.name}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-black transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;