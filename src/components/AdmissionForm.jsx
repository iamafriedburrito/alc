import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CATEGORY, COURSES, EDUCATIONAL_QUALIFICATION, LANGUAGES, TIMINGS } from './FormOptions';
import { FormSelect, AadharInput, FormInput, AddressSection, MobileNumberSection } from './FormComponents';
import { toast } from 'react-toastify';
import ErrorFallback from './ErrorFallback';
import { generateAdmissionFormHTML } from './AdmissionFormTemplate';

const StudentAdmissionForm = () => {
    const [photoPreview, setPhotoPreview] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [instituteSettings, setInstituteSettings] = useState(null);
    const API_BASE = import.meta.env.VITE_API_URL
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
            certificateName: "",
            referredBy: "",
        },
        mode: "onBlur",
    });

    // Fetch institute settings
    const fetchInstituteSettings = async () => {
        try {
            const response = await fetch(`${API_BASE}/settings/institute`);
            
            if (response.ok) {
                const data = await response.json();
                setInstituteSettings(data);
            } else {
                // If settings not found, use default values
                setInstituteSettings({
                    name: 'TechSkill Training Institute',
                    address: '123 Knowledge Park, Karvenagar, Pune - 411052',
                    phone: '+91 98765 43210',
                    email: 'info@techskill.edu.in',
                    website: 'www.techskill.edu.in',
                    logo: null
                });
            }
        } catch (error) {
            console.error('Error fetching institute settings:', error);
            // Use default values on error
            setInstituteSettings({
                name: 'TechSkill Training Institute',
                address: '123 Knowledge Park, Karvenagar, Pune - 411052',
                phone: '+91 98765 43210',
                email: 'info@techskill.edu.in',
                website: 'www.techskill.edu.in',
                logo: null
            });
        }
    };

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

    useEffect(() => {
        const checkServer = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE}/admissions`, { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Server unavailable');
                }
                // Fetch institute settings after server check
                await fetchInstituteSettings();
            } catch (err) {
                setError('Cannot connect to server. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        checkServer();
    }, [API_BASE]);


    // Helper functions for preview (these are also in the template)
    const getInstituteLogo = () => {
        if (instituteSettings?.logo) {
            return `${API_BASE.replace('/api', '')}/uploads/${instituteSettings.logo}`;
        }
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_TV_2015.svg/512px-Logo_TV_2015.svg.png";
    };

    const getInstituteName = () => {
        return instituteSettings?.name || 'TechSkill Training Institute';
    };

    const getInstituteAddress = () => {
        return instituteSettings?.address || '123 Knowledge Park, Karvenagar, Pune - 411052';
    };

    const getInstituteContact = () => {
        const phone = instituteSettings?.phone || '+91 98765 43210';
        const email = instituteSettings?.email || 'info@techskill.edu.in';
        return `Phone: ${phone} | Email: ${email}`;
    };

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
            setError(null);
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

            const response = await fetch(`${API_BASE}/admission`, {
                method: "POST",
                body: formData, // No headers needed for FormData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Show success message
            toast.success(
                `Admission submitted successfully! Admission ID: ${result.admission_id || result.id}`,
            );

            // Generate and open admit form in new tab
            generateAdmitForm(textFields, result.admission_id || result.id, photoPreview, signaturePreview);

            // Reset form after successful submission
            reset();
            setPhotoPreview(null);
            setSignaturePreview(null);
        } catch (error) {
            console.error("Error submitting admission:", error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
        }
    };

    const generateAdmitForm = (formData, admissionId, photoPreview, signaturePreview) => {
        // Generate HTML using the template
        const admitFormHTML = generateAdmissionFormHTML(formData, admissionId, photoPreview, signaturePreview, instituteSettings, API_BASE);

        // Create blob and open in new tab (modern approach)
        const blob = new Blob([admitFormHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');

        // Clean up the blob URL after a short delay to allow the page to load
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
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
                            Admission Form
                        </h2>
                        <p className="text-gray-600">
                            Please fill in the applicant's details to complete the admission process.
                        </p>
                        

                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

                        {/* Educational & Course Information Section */}
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
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm">
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
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
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
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
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
