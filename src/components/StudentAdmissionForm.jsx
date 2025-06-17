import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

const StudentAdmissionForm = () => {
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      certificateName: "",
      courseName: "",
      referredBy: "",
      joinedWhatsApp: false,
      admissionDate: today,
      dateOfBirth: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      educationalQualification: "",
      aadharNumber: "",
      correspondenceAddress: "",
      city: "",
      state: "MAHARASHTRA",
      district: "",
      affirmation: false,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Only update certificate name if firstName, middleName, or lastName changes
      if (
        name === "firstName" ||
        name === "middleName" ||
        name === "lastName"
      ) {
        const { firstName, middleName, lastName } = value;

        // Create certificate name by combining names with spaces
        const certificateName = [firstName, middleName, lastName]
          .filter((name) => name && name.trim()) // Remove empty/undefined names
          .join(" ")
          .toUpperCase();

        // Only update if there's actually a name to set
        if (certificateName.trim()) {
          setValue("certificateName", certificateName);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Transform relevant text fields to uppercase before appending
      const textFields = {
        ...data,
        firstName: data.firstName.toUpperCase(),
        middleName: data.middleName.toUpperCase(),
        lastName: data.lastName.toUpperCase(),
        certificateName: data.certificateName.toUpperCase(),
        referredBy: data.referredBy.toUpperCase(),
        city: data.city.toUpperCase(),
        district: data.district.toUpperCase(),
        correspondenceAddress: data.correspondenceAddress.toUpperCase(),
      };

      // Append text fields to FormData
      Object.entries(textFields).forEach(([key, value]) => {
        if (key !== "photo" && key !== "signature") {
          formData.append(key, value);
        }
      });

      // Append files
      if (data.photo?.[0]) {
        formData.append("photo", data.photo[0]);
      }
      if (data.signature?.[0]) {
        formData.append("signature", data.signature[0]);
      }

      const response = await fetch("http://localhost:8000/api/admission", {
        method: "POST",
        body: formData, // No headers needed for FormData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(
        `Admission submitted successfully! Admission ID: ${result.admission_id || result.id}`,
      );
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error submitting admission:", error);

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

  // Enhanced Aadhar Input Component
  const AadharInput = ({ field, fieldState }) => {
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
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm font-mono text-lg tracking-wider ${
            fieldState.error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {fieldState.error && (
          <p className="mt-1 text-sm text-red-600">
            {fieldState.error.message}
          </p>
        )}
      </div>
    );
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

  // Reusable Input Component
  const FormInput = ({
    name,
    label,
    type = "text",
    placeholder,
    required = false,
    transform = false,
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
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${
          errors[name]
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
  const FormSelect = ({
    name,
    label,
    options,
    required = false,
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
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${
          errors[name]
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

  // Reusable Checkbox Component
  const FormCheckbox = ({ name, label, required = false }) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={name}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className="accent-blue-500"
      />
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormInput
                    name="firstName"
                    label="First Name / Given Name"
                    placeholder="First name"
                    required
                    transform
                  />
                  <FormInput
                    name="middleName"
                    label="Middle Name"
                    placeholder="Middle name"
                    transform
                  />
                  <FormInput
                    name="lastName"
                    label="Last Name / Surname"
                    placeholder="Last name"
                    required
                    transform
                  />
                </div>

                <FormInput
                  name="certificateName"
                  label="Name as it should appear on Certificate"
                  placeholder="Full name for certificate"
                  required
                  transform
                />
              </div>

              {/* Date of Birth, Admission Date, Aadhaar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <FormInput
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  required
                />
                <FormInput
                  name="admissionDate"
                  label="Admission Date"
                  type="date"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="aadharNumber"
                    control={control}
                    rules={{
                      required: "Aadhaar number is required",
                      pattern: {
                        value: /^\d{12}$/,
                        message: "Please enter a valid 12-digit Aadhaar number",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <AadharInput field={field} fieldState={fieldState} />
                    )}
                  />
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
                  <FormInput
                    name="correspondenceAddress"
                    label="Address"
                    placeholder="Enter complete address"
                    required
                    transform
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    name="city"
                    label="City / Town / Village"
                    placeholder="City/Town/Village"
                    required
                    transform
                  />

                  <FormInput
                    name="state"
                    label="State"
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none cursor-not-allowed"
                  />

                  <FormSelect
                    name="district"
                    label="District"
                    placeholder="Select district"
                    required
                    options={districts.map((district) => ({
                      value: district,
                      label: district,
                    }))}
                  />
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
                      className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${
                        errors.mobileNumber
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
                      className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${
                        errors.alternateMobileNumber
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

            {/* Course and Additional Information Section */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                  4
                </span>
                Course & Additional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormSelect
                  name="courseName"
                  label="Course Name"
                  placeholder="Select course"
                  required
                  options={[
                    { value: "web-development", label: "Web Development" },
                    { value: "data-science", label: "Data Science" },
                    { value: "machine-learning", label: "Machine Learning" },
                    {
                      value: "mobile-development",
                      label: "Mobile Development",
                    },
                    { value: "digital-marketing", label: "Digital Marketing" },
                    { value: "graphic-design", label: "Graphic Design" },
                    { value: "other", label: "Other" },
                  ]}
                />

                <FormInput
                  name="referredBy"
                  label="Referred By"
                  placeholder="Enter referrer's name"
                  transform
                />

                <FormSelect
                  name="educationalQualification"
                  label="Educational Qualification"
                  placeholder="Select qualification"
                  required
                  options={[
                    { value: "school", label: "School Student" },
                    { value: "10th", label: "10th Standard" },
                    { value: "12th", label: "12th Standard" },
                    { value: "diploma", label: "Diploma" },
                    { value: "bachelors", label: "Bachelor's Degree" },
                    { value: "masters", label: "Master's Degree" },
                  ]}
                />
              </div>

              <FormCheckbox
                name="joinedWhatsApp"
                label="Joined WhatsApp Group"
              />
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
                    Passport Size Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    {...register("photo", { required: "Photo is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                  />
                  {errors.photo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.photo.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="signature"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Signature <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="signature"
                    accept="image/*"
                    {...register("signature", {
                      required: "Signature is required",
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                  />
                  {errors.signature && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.signature.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Affirmation Section */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                  5
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

              <FormCheckbox
                name="affirmation"
                label="I solemnly affirm that the name, photo, and signature on this form match my proof of identity, and I have understood the information about the course."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Admission Form"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;
