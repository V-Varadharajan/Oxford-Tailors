import React from 'react';
import { Scissors, Crown } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  variant = 'default',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const colorClasses = {
    default: 'text-blue-600',
    white: 'text-white',
    dark: 'text-gray-800'
  };

  const textColorClasses = {
    default: 'text-gray-800',
    white: 'text-white',
    dark: 'text-gray-800'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={`${sizeClasses[size]} ${colorClasses[variant]} relative`}>
          <Crown className="w-full h-full" />
          <Scissors className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'} ${colorClasses[variant]} opacity-80`} />
        </div>
      </div>
      
      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} ${textColorClasses[variant]} leading-none`}>
            Oxford Tailors
          </span>
          {size !== 'sm' && (
            <span className={`text-xs ${textColorClasses[variant]} opacity-60 font-medium tracking-wide`}>
              PREMIUM TAILORING
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;