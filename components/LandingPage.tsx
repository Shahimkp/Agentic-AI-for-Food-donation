import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-brand-black text-white z-[100] flex flex-col justify-between p-6 md:p-12 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-volt rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-700 rounded-full blur-[100px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 animate-fade-in opacity-0">
        <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
          Sustainable Nutrition Network
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
        <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter mix-blend-difference animate-fade-in-up">
          VITAL
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-md text-center font-light tracking-wide animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          FEED THE CYCLE.
        </p>
      </div>

      {/* Footer / Action */}
      <div className="relative z-10 flex justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
        <button 
          onClick={onEnter}
          className="group relative flex items-center gap-4 px-12 py-4 bg-white text-black rounded-full font-bold tracking-tight hover:bg-brand-volt transition-all duration-500 ease-out"
        >
          <span className="relative z-10">ENTER PLATFORM</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-12 right-12 w-4 h-4 border-t border-r border-white/30 hidden md:block"></div>
      <div className="absolute bottom-12 left-12 w-4 h-4 border-b border-l border-white/30 hidden md:block"></div>
    </div>
  );
};

export default LandingPage;