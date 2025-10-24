import React, { useState } from 'react';
import useStateContext from '../hooks/useStateContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { context, setContext } = useStateContext();
  const {resetContext}=useStateContext()
  const navigate=useNavigate();

  const isLoggedIn = context.participantId > 0; 



  const handleLogout = () => {
    resetContext();
    navigate("/");
    alert("Ju keni dal me sukses,nga llogaria");
  };


  return (
    <nav className="bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400 shadow-lg p-4 sticky top-0 z-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img 
            className="w-12 h-12 animate-bounce" 
            src="https://merakiui.com/images/full-logo.svg" 
            alt="Logo" 
          />
          <span className="text-2xl font-extrabold text-white drop-shadow-lg">FunQuiz</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
        
          {/* Login / Logout button */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="text-white font-bold text-lg px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition-colors"
            >
              Logout
            </button>
          ) : (
            <a href="/" 
              className="text-white font-bold text-lg px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 transition-colors"
            >
              Login
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 rounded-xl shadow-lg p-4 space-y-3 animate-slideDown">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className="block text-white text-lg font-bold p-2 rounded-xl bg-pink-500 hover:bg-yellow-300 transition-colors text-center"
            >
              {item}
            </a>
          ))}

          {/* Mobile Login / Logout */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="w-full text-white font-bold text-lg p-2 rounded-xl bg-red-500 hover:bg-red-400 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={handleLogin} 
              className="w-full text-white font-bold text-lg p-2 rounded-xl bg-green-500 hover:bg-green-400 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
