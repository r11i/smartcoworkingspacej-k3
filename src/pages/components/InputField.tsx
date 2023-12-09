// InputField.tsx
import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (newValue: string) => void;
  className: string;
  inputClass?: string;
  labelStyle?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, className, inputClass, labelStyle }) => {
  const defaultClasses = "block border-solid rounded-[10px] border-[2px] px-[19px] py-[9px] w-[100%] ";
  const combinedClasses = className ? `${defaultClasses} ${className}` : defaultClasses;
  const inputClasses = `${defaultClasses} ${inputClass || ''}`;
  const labelClasses = `font-bold ${labelStyle || ''}`;
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div data-testid="input-container" className={className}>
      <label htmlFor="inputField" className={labelClasses}>{label}</label>
      <input
        className={inputClasses}
        type="text"
        id="inputField"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
