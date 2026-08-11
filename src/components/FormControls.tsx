'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────
// INPUT COMPONENT (With Icon & Focus Glow)
// ─────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ElementType;
  floating?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon: Icon, floating = false, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-body">
        {label && !floating && (
          <label htmlFor={inputId} className="block font-heading font-semibold text-xs text-primary uppercase tracking-wider">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors pointer-events-none z-10">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-3 rounded-xl border bg-white/90 backdrop-blur-xs font-body text-sm text-primary placeholder:text-gray-400 focus:outline-none transition-all duration-200 ${
              error
                ? 'border-rose-400 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500 bg-rose-50/30'
                : 'border-gray-200/90 hover:border-gray-300 focus:ring-4 focus:ring-accent/15 focus:border-accent shadow-xs'
            } ${className}`}
            {...props}
          />
        </div>

        {error ? (
          <p className="font-body text-xs text-rose-500 flex items-center gap-1 pt-0.5 animate-fade-in-up">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="font-body text-xs text-muted pl-0.5">{helperText}</p>
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
  icon?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  icon?: React.ElementType;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, icon: Icon, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-body">
        {label && (
          <label htmlFor={selectId} className="block font-heading font-semibold text-xs text-primary uppercase tracking-wider">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors pointer-events-none z-10">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <select
            id={selectId}
            ref={ref}
            className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-3 rounded-xl border bg-white/90 backdrop-blur-xs font-body text-sm text-primary focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
              error
                ? 'border-rose-400 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500'
                : 'border-gray-200/90 hover:border-gray-300 focus:ring-4 focus:ring-accent/15 focus:border-accent shadow-xs'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Arrow */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {error ? (
          <p className="font-body text-xs text-rose-500 flex items-center gap-1 pt-0.5 animate-fade-in-up">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="font-body text-xs text-muted pl-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ─────────────────────────────────────────────
// TEXTAREA COMPONENT
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
      <div className="w-full space-y-1.5 font-body">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="block font-heading font-semibold text-xs text-primary uppercase tracking-wider">
              {label}
              {props.required && <span className="text-accent ml-1">*</span>}
            </label>
            {showCount && (
              <span className={`font-body text-[11px] tabular-nums transition-colors ${
                isOverLimit ? 'text-rose-500 font-bold' : 'text-muted'
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
          className={`w-full px-4 py-3 rounded-xl border bg-white/90 backdrop-blur-xs font-body text-sm text-primary placeholder:text-gray-400 focus:outline-none transition-all duration-200 resize-y ${
            error || isOverLimit
              ? 'border-rose-400 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500 bg-rose-50/30'
              : 'border-gray-200/90 hover:border-gray-300 focus:ring-4 focus:ring-accent/15 focus:border-accent shadow-xs'
          } ${className}`}
          {...props}
        />

        {error ? (
          <p className="font-body text-xs text-rose-500 flex items-center gap-1 pt-0.5 animate-fade-in-up">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="font-body text-xs text-muted pl-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ─────────────────────────────────────────────
// INTERACTIVE CHIP / PILL SELECTOR COMPONENT
// ─────────────────────────────────────────────
export interface ChipOption {
  value: string;
  label: string;
  icon?: React.ElementType | string;
  badge?: string;
}

export interface ChipGroupProps {
  label?: string;
  options: ChipOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  required,
  error,
  helperText,
}) => {
  return (
    <div className="w-full space-y-2 font-body">
      {label && (
        <label className="block font-heading font-semibold text-xs text-primary uppercase tracking-wider">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          const IconComp = typeof opt.icon !== 'string' ? opt.icon : null;
          const emoji = typeof opt.icon === 'string' ? opt.icon : null;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/25 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-gray-700 hover:text-primary border-gray-200/90 hover:border-gray-300 shadow-xs'
              }`}
            >
              {IconComp && <IconComp className="w-4 h-4" />}
              {emoji && <span className="text-sm">{emoji}</span>}
              <span>{opt.label}</span>
              {opt.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-muted'}`}>
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="font-body text-xs text-rose-500 flex items-center gap-1 pt-0.5 animate-fade-in-up">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="font-body text-xs text-muted pl-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

// ─────────────────────────────────────────────
// FILE DROPZONE COMPONENT
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
  label = 'Attach File / Design Brief (Optional)',
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
    <div className={`w-full space-y-1.5 font-body ${className}`}>
      {label && (
        <p className="font-heading font-semibold text-xs text-primary uppercase tracking-wider">{label}</p>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2.5 p-6 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all duration-200 ${
          isDragOver
            ? 'border-accent bg-accent/10 shadow-lg scale-[1.01]'
            : selectedFile
            ? 'border-emerald-300 bg-emerald-50/40'
            : 'border-gray-200/90 bg-white/60 hover:bg-white hover:border-gray-300'
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
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-heading font-bold text-xs text-primary block truncate max-w-[220px]">
                {selectedFile.name}
              </span>
              <span className="font-body text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Ready to upload ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFile(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="p-1.5 rounded-lg hover:bg-rose-100 text-gray-400 hover:text-rose-500 transition-colors ml-2 cursor-pointer"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs text-primary">
                <span className="text-accent">Click to upload brief</span> or drag & drop file
              </p>
              <p className="font-body text-[11px] text-muted mt-0.5">{helperText}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
