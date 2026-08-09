import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  variant?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  variant,
  title,
  children,
  onClose,
  className = '',
}) => {
  const alertType = variant || type || 'info';
  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    },
  };

  const currentStyle = styles[alertType];

  return (
    <div
      role="alert"
      className={`p-4 rounded-btn border flex items-start gap-3 transition-all duration-200 ${currentStyle.bg} ${className}`}
    >
      <div className="mt-0.5">{currentStyle.icon}</div>
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-heading font-semibold text-sm">{title}</h4>}
        <div className="font-body text-xs sm:text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 text-gray-500 transition-colors focus-ring"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
