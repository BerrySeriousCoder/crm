import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: LucideIcon;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;