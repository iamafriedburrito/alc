import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { districts } from './districts';
import { FormSelect, AadharInput, FormInput } from './FormComponents';
import { toast } from 'react-toastify';

const StudentAdmissionForm = () => {
    const today = new Date().toISOString().split("T")[0];
    const [photoPreview, setPhotoPreview] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);

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
            dateOfBirth: "",
            gender: "",
            maritalStatus: "",
            motherTongue: "",
            aadharNumber: "",
            correspondenceAddress: "",
            city: "",
            state: "MAHARASHTRA",
            district: "",
            mobileNumber: "",
            alternateMobileNumber: "",
            category: "",
            educationalQualification: "",
            courseName: "",
            timing: "",
            referredBy: "",
            admissionDate: today,
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

    // Handle photo file change and preview
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
        }
    };

    // Handle signature file change and preview
    const handleSignatureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSignaturePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSignaturePreview(null);
        }
    };

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
            toast.success(
                `Admission submitted successfully! Admission ID: ${result.admission_id || result.id}`,
            );
            reset(); // Reset form after successful submission
            setPhotoPreview(null);
            setSignaturePreview(null);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Admission Form
                        </h2>
                        <p className="text-gray-600">
                            Please fill in the applicant's details to complete the admission process.
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormInput
                                    name="firstName"
                                    label="First Name / Given Name"
                                    placeholder="First name"
                                    required
                                    register={register}
                                    errors={errors}
                                />
                                <FormInput
                                    name="middleName"
                                    label="Middle Name"
                                    placeholder="Middle name"
                                    register={register}
                                    errors={errors}
                                />
                                <FormInput
                                    name="lastName"
                                    label="Last Name / Surname"
                                    placeholder="Last name"
                                    required
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            {/* Certificate Name */}
                            <div className="mb-6">
                                <FormInput
                                    name="certificateName"
                                    label="Name as it should appear on Certificate"
                                    placeholder="Full name for certificate"
                                    required
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            {/* Date of Birth, Gender, Marital Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormInput
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    type="date"
                                    required
                                    register={register}
                                    errors={errors}
                                />

                                <FormSelect
                                    name="gender"
                                    label="Gender"
                                    placeholder="Select Gender"
                                    options={[
                                        { value: "MALE", label: "MALE" },
                                        { value: "FEMALE", label: "FEMALE" },
                                        { value: "TRANSGENDER", label: "TRANSGENDER" },
                                    ]}
                                    required
                                    register={register}
                                    errors={errors}
                                />

                                <FormSelect
                                    name="maritalStatus"
                                    label="Marital Status"
                                    placeholder="Select Marital Status"
                                    options={[
                                        { value: "SINGLE", label: "SINGLE" },
                                        { value: "MARRIED", label: "MARRIED" },
                                    ]}
                                    required
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            {/* Mother Tongue and Aadhaar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormSelect
                                    name="motherTongue"
                                    label="Mother Tongue"
                                    placeholder="Select"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={[
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
                                    ]}
                                />

                                <div className="flex-1">
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
                                            className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${errors.mobileNumber
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
                                            className={`flex-1 px-4 py-3 rounded-r-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${errors.alternateMobileNumber
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

                        {/* Educational & Course Information Section */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    4
                                </span>
                                Educational & Course Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSelect
                                    name="category"
                                    label="Category"
                                    placeholder="Select category"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={[
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
                                    ]}
                                />

                                <FormSelect
                                    name="educationalQualification"
                                    label="Educational Qualification"
                                    placeholder="Select qualification"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={[
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
                                    ]}
                                />

                                <FormSelect
                                    name="courseName"
                                    label="Course Name"
                                    placeholder="Select course"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={[
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
                                    ]}
                                />

                                <FormSelect
                                    name="timing"
                                    label="Preferred Timing"
                                    placeholder="Select timing"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={[
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
                                    ]}
                                />

                                <FormInput
                                    name="referredBy"
                                    label="Referred By"
                                    placeholder="Enter referrer's name"
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        {/* Document Upload Section */}
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
                                        onChange={(e) => {
                                            register("photo").onChange(e);
                                            handlePhotoChange(e);
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    />
                                    {errors.photo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.photo.message}
                                        </p>
                                    )}
                                    {/* Photo Preview */}
                                    {photoPreview && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Photo Preview:</p>
                                            <div className="w-32 h-40 border-2 border-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={photoPreview}
                                                    alt="Photo Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
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
                                        onChange={(e) => {
                                            register("signature").onChange(e);
                                            handleSignatureChange(e);
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    />
                                    {errors.signature && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.signature.message}
                                        </p>
                                    )}
                                    {/* Signature Preview */}
                                    {signaturePreview && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Signature Preview:</p>
                                            <div className="w-32 h-20 border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                                                <img
                                                    src={signaturePreview}
                                                    alt="Signature Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
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
