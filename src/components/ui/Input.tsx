import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          block w-full rounded-md shadow-sm sm:text-sm
          ${error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;