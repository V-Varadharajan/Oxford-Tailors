import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Printer, Database, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
              <Logo size="md" showText={true} variant="default" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
            )}
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link
              to="/print-queue"
              className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <Printer className="h-5 w-5 mr-1" />
              Print Queue
            </Link>
            <Link
              to="/backup"
              className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <Database className="h-5 w-5 mr-1" />
              Backup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {showBack && (
                <button
                  onClick={() => {
                    navigate(-1);
                    closeMobileMenu();
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Back
                </button>
              )}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              <Link
                to="/print-queue"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Printer className="h-5 w-5 mr-3" />
                Print Queue
              </Link>
              <Link
                to="/backup"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Database className="h-5 w-5 mr-3" />
                Backup
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;