import React from "react";
import { DISTRICTS } from "./FormOptions";
import { formatAadhar } from "./utils.jsx";

// Enhanced Aadhar Input Component
export const AadharInput = ({ field, fieldState }) => {
    const handleAadharChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Only digits
        if (value.length <= 12) {
            field.onChange(value);
        }
    };

    return (
        <div>
            <input
                {...field}
                onChange={handleAadharChange}
                value={formatAadhar(field.value)}
                placeholder="1234 5678 9012"
                maxLength="14" // 12 digits + 2 spaces
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs font-mono tracking-wider ${fieldState.error
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
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs ${errors[name]
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
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs ${errors[name]
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

// Reusable Address Section Component
export const AddressSection = ({ register, errors }) => {
    return (
        <div className="bg-white/50 backdrop-blur-xs p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                    2
                </span>
                Address for Correspondence
            </h3>

            <div className="space-y-6">
                <div>
                    <FormInput
                        name="correspondenceAddress"
                        label="Address"
                        placeholder="Enter complete address"
                        required
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                        name="city"
                        label="City / Town / Village"
                        placeholder="City/Town/Village"
                        required
                        register={register}
                        errors={errors}
                    />

                    <FormInput
                        name="state"
                        label="State"
                        readOnly
                        register={register}
                        errors={errors}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none cursor-not-allowed"
                    />

                    <FormSelect
                        name="district"
                        label="District"
                        placeholder="Select district"
                        required
                        register={register}
                        errors={errors}
                        options={DISTRICTS}
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Mobile Number Section Component
export const MobileNumberSection = ({ register, errors, sectionNumber = 3 }) => {
    // Handler to only allow numeric input
    const handleNumericInput = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        e.target.value = value;
    };

    return (
        <div className="bg-white/50 backdrop-blur-xs p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                    {sectionNumber}
                </span>
                Mobile Number
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Mobile Number (Self) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-sm">
                            +91
                        </span>
                        <input
                            type="tel"
                            id="mobileNumber"
                            placeholder="Enter 10-digit mobile number"
                            maxLength="10"
                            onInput={handleNumericInput}
                            {...register("mobileNumber", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message:
                                        "Please enter a valid 10-digit mobile number",
                                },
                            })}
                            className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs ${errors.mobileNumber
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                        />
                    </div>
                    {errors.mobileNumber && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.mobileNumber.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="alternateMobileNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Alternate Mobile Number
                    </label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-sm">
                            +91
                        </span>
                        <input
                            type="tel"
                            id="alternateMobileNumber"
                            placeholder="Enter 10-digit mobile number"
                            maxLength="10"
                            onInput={handleNumericInput}
                            {...register("alternateMobileNumber", {
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message:
                                        "Please enter a valid 10-digit mobile number",
                                },
                            })}
                            className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs ${errors.alternateMobileNumber
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                        />
                    </div>
                    {errors.alternateMobileNumber && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.alternateMobileNumber.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

