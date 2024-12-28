import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  children,
}) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;