'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';

// ─────────────────────────────────────────────
// INPUT COMPONENT (with optional floating label)
// ─────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  floating?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, floating = false, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    if (floating && label) {
      return (
        <div className="w-full space-y-1">
          <div className="floating-label-group">
            <input
              id={inputId}
              ref={ref}
              placeholder=" "
              className={`w-full px-4 py-3.5 pt-5 rounded-btn border bg-white font-body text-sm text-primary placeholder:text-transparent focus-ring transition-colors ${
                error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 hover:border-gray-400'
              } ${className}`}
              {...props}
            />
            <label htmlFor={inputId}>
              {label}
              {props.required && <span className="text-accent ml-0.5">*</span>}
            </label>
          </div>
          {error ? (
            <p className="font-body text-xs text-red-500 pl-1 animate-fade-in-up">{error}</p>
          ) : helperText ? (
            <p className="font-body text-xs text-muted pl-1">{helperText}</p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block font-heading font-medium text-sm text-primary">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-3 rounded-btn border bg-white font-body text-sm text-primary placeholder:text-gray-400 focus-ring transition-colors ${
            error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 hover:border-gray-400'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="font-body text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="font-body text-xs text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─────────────────────────────────────────────
// SELECT COMPONENT
// ─────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block font-heading font-medium text-sm text-primary">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-4 py-3 rounded-btn border bg-white font-body text-sm text-primary focus-ring transition-colors ${
            error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 hover:border-gray-400'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="font-body text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="font-body text-xs text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ─────────────────────────────────────────────
// TEXTAREA COMPONENT (with character counter)
// ─────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCount = false, maxChars = 2000, className = '', id, rows = 4, value, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : 0;
    const isOverLimit = maxChars > 0 && charCount > maxChars;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="block font-heading font-medium text-sm text-primary">
              {label}
              {props.required && <span className="text-accent ml-1">*</span>}
            </label>
            {showCount && (
              <span className={`font-body text-xs tabular-nums transition-colors ${
                isOverLimit ? 'text-red-500 font-semibold' : 'text-muted'
              }`}>
                {charCount.toLocaleString()}/{maxChars.toLocaleString()}
              </span>
            )}
          </div>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          value={value}
          className={`w-full px-4 py-3 rounded-btn border bg-white font-body text-sm text-primary placeholder:text-gray-400 focus-ring transition-colors resize-y ${
            error || isOverLimit ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 hover:border-gray-400'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="font-body text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="font-body text-xs text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ─────────────────────────────────────────────
// FILE DROPZONE COMPONENT (visual-only)
// ─────────────────────────────────────────────
export interface FileDropzoneProps {
  label?: string;
  accept?: string;
  helperText?: string;
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label = 'Attach a file (optional)',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.figma',
  helperText = 'PDF, DOC, PNG, JPG — max 10 MB',
  onFileSelect,
  selectedFile,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0] || null;
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <p className="font-heading font-medium text-sm text-primary">{label}</p>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`dropzone flex flex-col items-center justify-center gap-2 p-6 cursor-pointer text-center ${
          isDragOver ? 'drag-over' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        {selectedFile ? (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <FileText className="w-5 h-5 text-accent" />
            <span className="font-body text-sm text-primary font-medium truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFile(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-muted" />
            <p className="font-body text-sm text-muted">
              <span className="text-accent font-medium">Click to upload</span> or drag & drop
            </p>
          </>
        )}
      </div>
      {helperText && !selectedFile && (
        <p className="font-body text-xs text-muted pl-1">{helperText}</p>
      )}
    </div>
  );
};
