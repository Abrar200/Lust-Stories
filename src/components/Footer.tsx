import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Main copyright text */}
          <p className="text-center text-gray-400 text-sm">
            © 2025 Lust Stories. All rights reserved.
          </p>
          
          {/* Powered by Nexa Digital */}
          <p className="text-center text-gray-500 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-pink-500 fill-pink-500" /> by{' '}
            <a 
              href="https://nexadigital.com.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors font-medium"
            >
              Nexa Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};