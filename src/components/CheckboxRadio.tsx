import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = '', ...props }, ref) => {
    const checkboxId = id || `chk-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          className={`w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent focus-ring ${className}`}
          {...props}
        />
        <span className="font-heading font-medium text-sm text-primary">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, id, className = '', ...props }, ref) => {
    const radioId = id || `rad-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <label htmlFor={radioId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="radio"
          id={radioId}
          ref={ref}
          className={`w-4 h-4 border-gray-300 text-accent focus:ring-accent accent-accent focus-ring ${className}`}
          {...props}
        />
        <span className="font-heading font-medium text-sm text-primary">{label}</span>
      </label>
    );
  }
);
Radio.displayName = 'Radio';
