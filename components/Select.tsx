import React, { ChangeEvent } from "react";

type Option = {
  id: string | number;
  label: string;
};

type SelectProps = {
  labelSelect: string;
  labelOption: string;
  options: Option[] | [];
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  error?: string;
  required?: boolean;
};

export default function Select({
  labelSelect,
  labelOption,
  options,
  value,
  onChange,
  className,
  required = false,
  error,
}: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <label className="block text-xs text-gray-700 mb-2">{labelSelect}</label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full p-3 text-sm text-gray-700 placeholder-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black fontMon"
        required={required}
      >
        <option value="">{labelOption}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-[10px] fontMon mt-1">{error}</p>
      )}
    </div>
  );
}
