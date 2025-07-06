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

export const DISTRICTS = [
    { value: "AHMEDNAGAR", label: "AHMEDNAGAR" },
    { value: "AKOLA", label: "AKOLA" },
    { value: "AMRAVATI", label: "AMRAVATI" },
    { value: "AURANGABAD", label: "AURANGABAD" },
    { value: "BEED", label: "BEED" },
    { value: "BHANDARA", label: "BHANDARA" },
    { value: "BULDHANA", label: "BULDHANA" },
    { value: "CHANDRAPUR", label: "CHANDRAPUR" },
    { value: "DHULE", label: "DHULE" },
    { value: "GADCHIROLI", label: "GADCHIROLI" },
    { value: "GONDIA", label: "GONDIA" },
    { value: "HINGOLI", label: "HINGOLI" },
    { value: "JALGAON", label: "JALGAON" },
    { value: "JALNA", label: "JALNA" },
    { value: "KOLHAPUR", label: "KOLHAPUR" },
    { value: "LATUR", label: "LATUR" },
    { value: "MUMBAI CITY", label: "MUMBAI CITY" },
    { value: "MUMBAI SUBURBAN", label: "MUMBAI SUBURBAN" },
    { value: "NAGPUR", label: "NAGPUR" },
    { value: "NANDED", label: "NANDED" },
    { value: "NANDURBAR", label: "NANDURBAR" },
    { value: "NASHIK", label: "NASHIK" },
    { value: "OSMANABAD", label: "OSMANABAD" },
    { value: "PALGHAR", label: "PALGHAR" },
    { value: "PARBHANI", label: "PARBHANI" },
    { value: "PUNE", label: "PUNE" },
    { value: "RAIGAD", label: "RAIGAD" },
    { value: "RATNAGIRI", label: "RATNAGIRI" },
    { value: "SANGLI", label: "SANGLI" },
    { value: "SATARA", label: "SATARA" },
    { value: "SINDHUDURG", label: "SINDHUDURG" },
    { value: "SOLAPUR", label: "SOLAPUR" },
    { value: "THANE", label: "THANE" },
    { value: "WARDHA", label: "WARDHA" },
    { value: "WASHIM", label: "WASHIM", },
    { value: "YAVATMAL", label: "YAVATMAL", },
];

export const LANGUAGES = [
    { value: "MARATHI", label: "MARATHI" },
    { value: "HINDI", label: "HINDI" },
    { value: "ENGLISH", label: "ENGLISH" },
    { value: "GUJARATI", label: "GUJARATI" },
    { value: "BENGALI", label: "BENGALI" },
    { value: "TAMIL", label: "TAMIL" },
    { value: "TELUGU", label: "TELUGU" },
    { value: "KANNADA", label: "KANNADA" },
    { value: "MALAYALAM", label: "MALAYALAM" },
    { value: "PUNJABI", label: "PUNJABI" },
    { value: "URDU", label: "URDU" },
    { value: "OTHER", label: "OTHER" },
];

export const CATEGORY = [
    { value: "SCHOOL STUDENT", label: "SCHOOL STUDENT" },
    { value: "COLLEGE STUDENT", label: "COLLEGE STUDENT" },
    { value: "TEACHER", label: "TEACHER" },
    { value: "EMPLOYEE", label: "EMPLOYEE" },
    { value: "SELF EMPLOYED", label: "SELF EMPLOYED" },
    { value: "HOUSEWIFE", label: "HOUSEWIFE" },
    { value: "UNEMPLOYED", label: "UNEMPLOYED" },
    { value: "RETIRED", label: "RETIRED" },
    { value: "FARMER", label: "FARMER" },
    { value: "GOVT EMPLOYEE", label: "GOVT EMPLOYEE" },
    { value: "INDUSTRIAL WORKER", label: "INDUSTRIAL WORKER" },
    {
        value: "BUILDING CONSTRUCTION WORKER",
        label: "BUILDING CONSTRUCTION WORKER",
    },
    {
        value: "APPLICANT OF COMPETITIVE EXAMS (MPSC/UPSC)",
        label: "APPLICANT OF COMPETITIVE EXAMS (MPSC/UPSC)",
    },
    { value: "SENIOR CITIZEN", label: "SENIOR CITIZEN" },
    { value: "TRADER", label: "TRADER" },
    { value: "OTHER", label: "OTHER" },
]

export const EDUCATIONAL_QUALIFICATION = [
    { value: "1st-4th STD", label: "1st-4th STD." },
    { value: "5th STD", label: "5th STD." },
    { value: "6th STD", label: "6th STD." },
    { value: "7th STD", label: "7th STD." },
    { value: "8th STD", label: "8th STD." },
    { value: "9th STD", label: "9th STD." },
    { value: "10th STD", label: "10th STD." },
    { value: "11th STD", label: "11th STD." },
    { value: "12th STD", label: "12th STD." },
    { value: "DIPLOMA", label: "DIPLOMA" },
    { value: "FY-TY", label: "FY to TY" },
    { value: "GRADUATE", label: "GRADUATE" },
    { value: "POST GRADUATE", label: "POST GRADUATE" },
    { value: "OTHER", label: "OTHER" },
];

export const COURSES = [
    { value: "MS-CIT", label: "MS-CIT" },
    { value: "ADVANCE TALLY - CIT", label: "ADVANCE TALLY - CIT" },
    { value: "ADVANCE TALLY - KLIC", label: "ADVANCE TALLY - KLIC" },
    { value: "ADVANCE EXCEL - CIT", label: "ADVANCE EXCEL - KLIC" },
    { value: "ENGLISH TYPING - MKCL", label: "ENGLISH TYPING - MKCL" },
    { value: "ENGLISH TYPING - CIT", label: "ENGLISH TYPING - CIT" },
    { value: "ENGLISH TYPING - GOVT", label: "ENGLISH TYPING - GOVT" },
    { value: "MARATHI TYPING - MKCL", label: "MARATHI TYPING - MKCL" },
    { value: "MARATHI TYPING - CIT", label: "MARATHI TYPING - CIT" },
    { value: "MARATHI TYPING - GOVT", label: "MARATHI TYPING - GOVT" },
    { value: "DTP - CIT", label: "DTP - CIT" },
    { value: "DTP - KLIC", label: "DTP - KLIC" },
    { value: "IT - KLIC", label: "IT - KLIC" },
    { value: "KLIC DIPLOMA", label: "KLIC DIPLOMA" },
];

export const TIMINGS = [
    { value: "8AM-9AM", label: "8AM to 9AM" },
    { value: "9AM-10AM", label: "9AM to 10AM" },
    { value: "10AM-11AM", label: "10AM to 11AM" },
    { value: "11AM-12PM", label: "11AM to 12PM" },
    { value: "12PM-1PM", label: "12PM to 1PM" },
    { value: "1PM-2PM", label: "1PM to 2PM" },
    { value: "2PM-3PM", label: "2PM to 3PM" },
    { value: "3PM-4PM", label: "3PM to 4PM" },
    { value: "4PM-5PM", label: "4PM to 5PM" },
    { value: "5PM-6PM", label: "5PM to 6PM" },
    { value: "6PM-7PM", label: "6PM to 7PM" },
    { value: "7PM-8PM", label: "7PM to 8PM" },
    { value: "8PM-9PM", label: "8PM to 9PM" },
    { value: "9PM-10PM", label: "9PM to 10PM" },
];

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
                            {...register("alternateMobileNumber", {
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message:
                                        "Please enter a valid 10-digit mobile number",
                                },
                            })}
                            className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs ${errors.alternateMobileNumber
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

