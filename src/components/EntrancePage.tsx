import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EntrancePageProps {
  onEnter: () => void;
}

export const EntrancePage: React.FC<EntrancePageProps> = ({ onEnter }) => {
  const navigate = useNavigate();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/login/super-admin');
  };

  return (
    <div 
      className="min-h-screen w-full bg-black flex items-center justify-center cursor-pointer relative"
      onClick={onEnter}
    >
      <img 
        src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761915046972_7ede786d.png" 
        alt="Lust Story - Enter"
        className="w-full h-full object-contain max-w-5xl px-4"
      />
      
      {/* Super Admin Access */}
      <button
        onClick={handleAdminClick}
        className="absolute bottom-8 right-8 text-gray-600 hover:text-purple-400 text-sm transition-colors"
      >
        Super Admin
      </button>
    </div>
  );
};
