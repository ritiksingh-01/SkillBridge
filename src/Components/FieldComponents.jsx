import React from 'react';
import { X, Plus, Upload, FileText } from 'lucide-react';

// TextField Component
export const TextField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  disabled = false, 
  editMode = false, 
  placeholder = '' 
}) => {
  if (!editMode) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
          {value || <span className="text-gray-400 italic">Not specified</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled 
            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      />
    </div>
  );
};

// TextAreaField Component
export const TextAreaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  editMode = false, 
  rows = 3, 
  placeholder = '' 
}) => {
  if (!editMode) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 min-h-[80px]">
          {value || <span className="text-gray-400 italic">Not specified</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors resize-vertical"
      />
    </div>
  );
};

// ArrayField Component
export const ArrayField = ({ 
  label, 
  name, 
  value = [], 
  onChange, 
  editMode = false, 
  placeholder = '', 
  options = [] 
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      const newValue = [...value, inputValue.trim()];
      onChange(name, newValue);
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(name, newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleOptionSelect = (option) => {
    if (!value.includes(option)) {
      const newValue = [...value, option];
      onChange(name, newValue);
    }
  };

  if (!editMode) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="min-h-[40px]">
          {value && value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-gray-400 italic">None specified</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* Predefined Options */}
      {options.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                disabled={value.includes(option)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  value.includes(option)
                    ? 'bg-blue-100 text-blue-800 border-blue-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Current Values */}
      {value && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-2 hover:text-blue-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// FileField Component
export const FileField = ({ 
  label, 
  value, 
  onChange, 
  editMode = false, 
  accept = '*/*' 
}) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileName = () => {
    if (typeof value === 'string') {
      return value.split('/').pop() || 'Unknown file';
    }
    if (value && value.name) {
      return value.name;
    }
    return null;
  };

  if (!editMode) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
          {value ? (
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">{getFileName()}</span>
            </div>
          ) : (
            <span className="text-gray-400 italic">No file uploaded</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <div className="text-center">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept === 'application/pdf' ? 'PDF files only' : 'Any file type'}
            </p>
          </div>
        </button>
        
        {value && (
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">{getFileName()}</span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ target: { files: [null] } })}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={onChange}
        accept={accept}
        className="hidden"
      />
    </div>
  );
};