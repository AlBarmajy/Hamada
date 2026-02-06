import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChefHat } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const { cart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'المنيو', path: '/' },
    { name: 'تتبع طلبك', path: '/track' },
    { name: 'الإدارة', path: '/admin' },
  ];

  return (
    <nav className="bg-brand-red text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-gold">
            <ChefHat size={32} />
            <span>كشري حمادة</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-brand-gold text-brand-red' 
                      : 'hover:bg-red-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-red-700 rounded-full transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-brand-red transform translate-x-1/4 -translate-y-1/4 bg-brand-gold rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-700 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-red-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
