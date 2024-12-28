import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          block w-full rounded-md shadow-sm sm:text-sm
          ${error
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;