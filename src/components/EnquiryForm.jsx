import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { DISTRICTS, LANGUAGES, CATEGORY, COURSES, EDUCATIONAL_QUALIFICATION, TIMINGS } from "./FormComponents";
import { FormInput, AadharInput, FormSelect, AddressSection, MobileNumberSection } from "./FormComponents";
import { toast } from 'react-toastify';
import ErrorFallback from './ErrorFallback';
import { useState, useEffect } from 'react';

const StudentEnquiryForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
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
        },
        mode: "onBlur", // Validate on blur for better UX
    });

    const API_BASE = import.meta.env.VITE_API_URL

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkServer = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE}/enquiries`, { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Server unavailable');
                }
            } catch (err) {
                setError('Cannot connect to server. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        checkServer();
    }, [API_BASE]);

    const onSubmit = async (data) => {
        try {
            setError(null);
            const response = await fetch(`${API_BASE}/enquiry`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            toast.success(`Enquiry submitted successfully! Enquiry ID: ${result.enquiry_id}`);
            reset(); // Reset form after successful submission
            navigate('/enquiries'); // Redirect immediately
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking server status...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return <ErrorFallback error={error} onRetry={() => window.location.reload()} />;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-white/20">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Enquiry Form
                        </h2>
                        <p className="text-gray-600">
                            Please fill in the applicant's details to proceed with your enquiry.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm">
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormSelect
                                    name="motherTongue"
                                    label="Mother Tongue"
                                    placeholder="Select"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={LANGUAGES}
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

                        <AddressSection register={register} errors={errors} />
                        <MobileNumberSection register={register} errors={errors} sectionNumber={3} />

                        {/* Educational Information Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm">
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
                                    options={CATEGORY}
                                />

                                <FormSelect
                                    name="educationalQualification"
                                    label="Educational Qualification"
                                    placeholder="Select qualification"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={EDUCATIONAL_QUALIFICATION}
                                />

                                <FormSelect
                                    name="courseName"
                                    label="Course Name"
                                    placeholder="Select course"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={COURSES}
                                />

                                <FormSelect
                                    name="timing"
                                    label="Preferred Timing"
                                    placeholder="Select timing"
                                    required
                                    register={register}
                                    errors={errors}
                                    options={TIMINGS}
                                />
                            </div>
                        </div>


                        {/* Institute Use Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                                    5
                                </span>
                                For Institute Use
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    name="handledBy"
                                    label="Handled By"
                                    required
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-sm hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentEnquiryForm;
