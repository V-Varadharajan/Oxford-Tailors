import { Heart, Mail, Linkedin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center">
            <Logo size="sm" showText={true} variant="white" />
          </div>

          {/* Developer Contact */}
          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-white">Varadharajan Vijayasimhan</p>
            <div className="flex items-center justify-center md:justify-end space-x-3 mt-1">
              <a 
                href="mailto:varadharajan2507@gmail.com" 
                className="flex items-center text-xs text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="h-3 w-3 mr-1" />
                varadharajan2507@gmail.com
              </a>
              <a 
                href="https://www.linkedin.com/in/varadharajan-vijayasimhan/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-xs text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-3 w-3 mr-1" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <div className="flex items-center">
              <span>© 2025 Oxford Tailors</span>
              <span className="mx-2">•</span>
              <span>Made with</span>
              <Heart className="h-3 w-3 mx-1 text-red-400 fill-current" />
              <span>for tailoring professionals</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">v1.0</span>
              <span className="ml-2">React • MySQL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;