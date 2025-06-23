import React from "react";

// Enhanced Aadhar Input Component
export const AadharInput = ({ field, fieldState }) => {
    const handleAadharChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Only digits
        if (value.length <= 12) {
            field.onChange(value);
        }
    };

    const formatAadhar = (value) => {
        return value.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    return (
        <div>
            <input
                {...field}
                onChange={handleAadharChange}
                value={formatAadhar(field.value)}
                placeholder="1234 5678 9012"
                maxLength="14" // 12 digits + 2 spaces
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm font-mono text-lg tracking-wider ${fieldState.error
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
            />
            {fieldState.error && (
                <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
            )}
        </div>
    );
};

// Reusable Input Component
export const FormInput = ({
    name,
    label,
    type = "text",
    placeholder,
    required = false,
    transform = true,
    register = () => {
      console.warn("register is not passed to FormInput");
      return () => ({});
    },
    errors = {},
    ...props
}) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name, {
                required: required ? `${label} is required` : false,
                ...(type === "tel" && {
                    pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit mobile number",
                    },
                }),
                ...(transform && {
                    onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                    },
                }),
            })}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${errors[name]
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
            {...props}
        />
        {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
        )}
    </div>
);

// Reusable Select Component
export const FormSelect = ({
    name,
    label,
    options,
    required = false,
    register = () => {
      console.warn("register is not passed to FormSelect");
      return () => ({});
    },
    errors = {},
    placeholder = "Select...",
}) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={name}
            {...register(name, {
                required: required ? `${label} is required` : false,
            })}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${errors[name]
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
        )}
    </div>
);
