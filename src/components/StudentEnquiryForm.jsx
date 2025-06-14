import React, { useState } from "react";

const StudentEnquiryForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    motherTongue: "",
    aadharDigits: ["", "", "", "", "", "", "", "", "", "", "", ""],
    correspondenceAddress: "",
    city: "",
    state: "Maharashtra",
    district: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    category: "",
    educationalQualification: "",
    courseName: "",
    timing: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAadharChange = (index, value) => {
    // Only allow single digit
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newAadharDigits = [...formData.aadharDigits];
      newAadharDigits[index] = value;
      setFormData((prevState) => ({
        ...prevState,
        aadharDigits: newAadharDigits,
      }));

      // Auto-focus next input
      if (value && index < 11) {
        const nextInput = document.getElementById(`aadhar-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleAadharKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !formData.aadharDigits[index] && index > 0) {
      const prevInput = document.getElementById(`aadhar-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      // Combine aadhar digits into a single number
      const aadharNumber = formData.aadharDigits.join("");

      // Prepare the data to match backend model
      const formDataToSubmit = {
        firstName: formData.firstName,
        middleName: formData.middleName || "", // Handle optional field
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        motherTongue: formData.motherTongue,
        aadharNumber: aadharNumber,
        correspondenceAddress: formData.correspondenceAddress,
        city: formData.city,
        state: formData.state,
        district: formData.district,
        mobileNumber: formData.mobileNumber,
        alternateMobileNumber: formData.alternateMobileNumber || "", // Handle optional field
        category: formData.category,
        educationalQualification: formData.educationalQualification,
        courseName: formData.courseName,
        timing: formData.timing,
      };

      // Send POST request to backend
      const response = await fetch("http://localhost:8000/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSubmit),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle success
      console.log("Enquiry submitted successfully:", result);
      alert(`Enquiry submitted successfully! Enquiry ID: ${result.enquiry_id}`);

      // Optional: Reset form or redirect user
      // resetForm();
    } catch (error) {
      console.error("Error submitting enquiry:", error);

      // Handle errors
      if (error.message.includes("fetch")) {
        alert(
          "Network error: Please check if the server is running and try again.",
        );
      } else if (error.message.includes("HTTP error")) {
        alert("Server error: Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Add form validation before submission
  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "motherTongue",
      "correspondenceAddress",
      "city",
      "state",
      "district",
      "mobileNumber",
      "category",
      "educationalQualification",
      "courseName",
      "timing",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert(`Please fill in the ${field} field.`);
        return false;
      }
    }

    // Validate Aadhar number (should be 12 digits)
    const aadharNumber = formData.aadharDigits.join("");
    if (aadharNumber.length !== 12) {
      alert("Please enter a valid 12-digit Aadhar number.");
      return false;
    }

    // Validate mobile number (basic validation)
    if (formData.mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }

    return true;
  };

  // Enhanced handleSubmit with validation
  const handleSubmitWithValidation = async () => {
    if (!validateForm()) {
      return;
    }

    await handleSubmit();
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
              Student Enquiry Form
            </h2>
            <p className="text-gray-600">
              Please fill in your details to get started with your enquiry
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
                      required
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
              </div>

              {/* Date of Birth, Gender, Marital Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Date of Birth */}
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

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        required
                        className="accent-blue-500"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        required
                        className="accent-blue-500"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="married"
                        checked={formData.maritalStatus === "married"}
                        onChange={handleChange}
                        required
                        className="accent-blue-500"
                      />
                      <span>Married</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="single"
                        checked={formData.maritalStatus === "single"}
                        onChange={handleChange}
                        required
                        className="accent-blue-500"
                      />
                      <span>Single</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Mother Tongue and Aadhaar side by side */}
              <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
                {/* Mother Tongue (narrow) */}
                <div className="md:w-1/3 w-full">
                  <label
                    htmlFor="motherTongue"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mother Tongue
                  </label>
                  <select
                    id="motherTongue"
                    name="motherTongue"
                    value={formData.motherTongue}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm text-sm"
                  >
                    <option value="">Select</option>
                    <option value="marathi">Marathi</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="bengali">Bengali</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                    <option value="kannada">Kannada</option>
                    <option value="malayalam">Malayalam</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="urdu">Urdu</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Aadhaar Input (wider) */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-[500px]">
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
                          placeholder=""
                        />
                      ))}
                    </div>
                  </div>
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
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category and Educational Information Section */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                  4
                </span>
                Educational & Course Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Select category</option>
                    <option value="school-student">School Student</option>
                    <option value="college-student">College Student</option>
                    <option value="govt-employee">Government Employee</option>
                    <option value="housewife">Housewife</option>
                    <option value="other">Other</option>
                  </select>
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
                    htmlFor="timing"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Timing
                  </label>
                  <select
                    id="timing"
                    name="timing"
                    value={formData.timing}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Select timing</option>
                    <option value="8AM-9AM">8AM to 9AM </option>
                    <option value="9AM-10AM">9AM to 10AM </option>
                    <option value="10AM-11AM">10AM to 11AM </option>
                    <option value="11AM-12PM">11AM to 12PM </option>
                    <option value="12PM-1PM">12PM to 1PM </option>
                    <option value="1PM-2PM">1PM to 2PM </option>
                    <option value="2PM-3PM">2PM to 3PM </option>
                    <option value="3PM-4PM">3PM to 4PM </option>
                    <option value="4PM-5PM">4PM to 5PM </option>
                    <option value="5PM-6PM">5PM to 6PM </option>
                    <option value="6PM-7PM">6PM to 7PM </option>
                    <option value="7PM-8PM">7PM to 8PM </option>
                    <option value="8PM-9PM">8PM to 9PM </option>
                    <option value="9PM-10PM">9PM to 10PM </option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitWithValidation}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Submit Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnquiryForm;
