import React from 'react';
import { MapPin, Phone, Clock, Instagram } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo和网站链接 */}
          <div className="flex items-center space-x-8">
            <a 
              href="https://patchtattootherapy.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <img 
                src="/images/logo_sq_02@4x-8.png" 
                alt="Patch Tattoo Therapy" 
                className="h-12 w-12"
              />
            </a>
            
            {/* 导航链接 */}
            <nav className="hidden md:flex space-x-6">
              <a 
                href="https://patchtattootherapy.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a 
                href="https://patchtattootherapy.com/tattoo-training" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Tattoo Training
              </a>
              <a 
                href="https://patchtattootherapy.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;