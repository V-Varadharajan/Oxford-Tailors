import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Printer, Database } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== '/';

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo size="md" showText={true} variant="default" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
            )}
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link
              to="/print-queue"
              className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <Printer className="h-5 w-5 mr-1" />
              Print Queue
            </Link>
            <Link
              to="/backup"
              className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <Database className="h-5 w-5 mr-1" />
              Backup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;