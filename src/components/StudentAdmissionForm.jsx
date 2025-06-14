import React, { useState } from "react";

const StudentAdmissionForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        certificateName: "",
        courseName: "",
        referredBy: "",
        joinedWhatsApp: false,
        admissionDate: "",
        dateOfBirth: "",
        mobileNumber: "",
        alternateMobileNumber: "",
        educationalQualification: "",
        aadharDigits: ["", "", "", "", "", "", "", "", "", "", "", ""],
        correspondenceAddress: "",
        city: "",
        state: "Maharashtra",
        district: "",
        photo: null,
        signature: null,
        affirmation: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const isTextField =
            type === "text" ||
            type === "textarea" ||
            name === "firstName" ||
            name === "middleName" ||
            name === "lastName" ||
            name === "certificateName" ||
            name === "courseName" ||
            name === "referredBy" ||
            name === "educationalQualification" ||
            name === "city" ||
            name === "district" ||
            name === "correspondenceAddress";

        setFormData((prevState) => ({
            ...prevState,
            [name]:
                type === "checkbox"
                    ? checked
                    : isTextField
                        ? value.toUpperCase()
                        : value,
        }));
    };

    const handleAadharChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newAadharDigits = [...formData.aadharDigits];
            newAadharDigits[index] = value;
            setFormData((prevState) => ({
                ...prevState,
                aadharDigits: newAadharDigits,
            }));
            if (value && index < 11) {
                const nextInput = document.getElementById(`aadhar-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleAadharKeyDown = (index, e) => {
        if (e.key === "Backspace" && !formData.aadharDigits[index] && index > 0) {
            const prevInput = document.getElementById(`aadhar-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files[0],
        }));
    };

    const handleSubmit = () => {
        const aadharNumber = formData.aadharDigits.join("");
        const formDataToSubmit = {
            ...formData,
            aadharNumber,
        };
        console.log("Form submitted:", formDataToSubmit);
    };

    const districts = [
        "AHMEDNAGAR",
        "AKOLA",
        "AMRAVATI",
        "AURANGABAD",
        "BEED",
        "BHANDARA",
        "BULDHANA",
        "CHANDRAPUR",
        "DHULE",
        "GADCHIROLI",
        "GONDIA",
        "HINGOLI",
        "JALGAON",
        "JALNA",
        "KOLHAPUR",
        "LATUR",
        "MUMBAI CITY",
        "MUMBAI SUBURBAN",
        "NAGPUR",
        "NANDED",
        "NANDURBAR",
        "NASHIK",
        "OSMANABAD",
        "PALGHAR",
        "PARBHANI",
        "PUNE",
        "RAIGAD",
        "RATNAGIRI",
        "SANGLI",
        "SATARA",
        "SINDHUDURG",
        "SOLAPUR",
        "THANE",
        "WARDHA",
        "WASHIM",
        "YAVATMAL",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Student Admission Form
                        </h2>
                        <p className="text-gray-600">
                            Please provide your details to complete the admission process
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    1
                                </span>
                                Personal Information
                            </h3>

                            {/* Name Section */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            First Name / Given Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="middleName"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            id="middleName"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            placeholder="Middle name"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Last Name / Surname
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="certificateName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Name as it should appear on Certificate
                                    </label>
                                    <input
                                        type="text"
                                        id="certificateName"
                                        name="certificateName"
                                        value={formData.certificateName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Full name for certificate"
                                    />
                                </div>
                            </div>

                            {/* Date of Birth, Admission Date, Aadhaar */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label
                                        htmlFor="dateOfBirth"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="admissionDate"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Admission Date
                                    </label>
                                    <input
                                        type="date"
                                        id="admissionDate"
                                        name="admissionDate"
                                        value={formData.admissionDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Aadhaar Number
                                </label>
                                <div className="flex gap-2">
                                    {formData.aadharDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            id={`aadhar-${index}`}
                                            value={digit}
                                            onChange={(e) =>
                                                handleAadharChange(index, e.target.value)
                                            }
                                            onKeyDown={(e) => handleAadharKeyDown(index, e)}
                                            maxLength="1"
                                            className="w-8 h-8 text-center text-lg font-medium rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    2
                                </span>
                                Address for Correspondence
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="correspondenceAddress"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Address
                                    </label>
                                    <textarea
                                        id="correspondenceAddress"
                                        name="correspondenceAddress"
                                        value={formData.correspondenceAddress}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm resize-none"
                                        placeholder="Enter complete address"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            City / Town / Village
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            placeholder="City/Town/Village"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="state"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="district"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            District
                                        </label>
                                        <select
                                            id="district"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        >
                                            <option value="">Select district</option>
                                            {districts.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    3
                                </span>
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="mobileNumber"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Mobile Number (Self)
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            id="mobileNumber"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleChange}
                                            required
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            placeholder="Enter 10-digit mobile number"
                                        />
                                    </div>
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
                                            name="alternateMobileNumber"
                                            value={formData.alternateMobileNumber}
                                            onChange={handleChange}
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            placeholder="Enter 10-digit mobile number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course and Additional Information Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    4
                                </span>
                                Course & Additional Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label
                                        htmlFor="courseName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Course Name
                                    </label>
                                    <select
                                        id="courseName"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value="">Select course</option>
                                        <option value="web-development">Web Development</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="machine-learning">Machine Learning</option>
                                        <option value="mobile-development">
                                            Mobile Development
                                        </option>
                                        <option value="digital-marketing">Digital Marketing</option>
                                        <option value="graphic-design">Graphic Design</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="referredBy"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Referred By
                                    </label>
                                    <input
                                        type="text"
                                        id="referredBy"
                                        name="referredBy"
                                        value={formData.referredBy}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Enter referrer's name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="educationalQualification"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Educational Qualification
                                    </label>
                                    <select
                                        id="educationalQualification"
                                        name="educationalQualification"
                                        value={formData.educationalQualification}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value="">Select qualification</option>
                                        <option value="school">School Student</option>
                                        <option value="10th">10th Standard</option>
                                        <option value="12th">12th Standard</option>
                                        <option value="diploma">Diploma</option>
                                        <option value="bachelors">Bachelor's Degree</option>
                                        <option value="masters">Master's Degree</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="joinedWhatsApp"
                                    name="joinedWhatsApp"
                                    checked={formData.joinedWhatsApp}
                                    onChange={handleChange}
                                    className="accent-blue-500"
                                />
                                <label
                                    htmlFor="joinedWhatsApp"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Joined WhatsApp Group
                                </label>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    5
                                </span>
                                Document Upload
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="photo"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Passport Size Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="signature"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Signature
                                    </label>
                                    <input
                                        type="file"
                                        id="signature"
                                        name="signature"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes and Affirmation Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    6
                                </span>
                                Terms and Affirmation
                            </h3>
                            <div className="mb-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    Important Notes
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                                    <li>Fees are non-refundable under any circumstances.</li>
                                    <li>
                                        Admission may be cancelled if the student is absent for an
                                        extended period without a leave application.
                                    </li>
                                    <li>
                                        Admission may be cancelled due to misbehavior in class.
                                    </li>
                                    <li>
                                        Failure to pay fees monthly will incur a penalty, and the
                                        final exam date may be extended.
                                    </li>
                                </ul>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="affirmation"
                                    name="affirmation"
                                    checked={formData.affirmation}
                                    onChange={handleChange}
                                    required
                                    className="accent-blue-500"
                                />
                                <label
                                    htmlFor="affirmation"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    I solemnly affirm that the name, photo, and signature on this
                                    form match my proof of identity, and I have understood the
                                    information about the course.
                                </label>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            Submit Admission Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAdmissionForm;
