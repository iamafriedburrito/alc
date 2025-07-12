import React, { useEffect } from "react";

// Utility functions (can be imported from a utils file if moved later)
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatAadhar = (aadharNumber) => {
    if (!aadharNumber) return 'Not provided';
    return aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

const EnquiryDetailsModal = ({ open, onClose, enquiry, onConvertToAdmission }) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open || !enquiry) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Enquiry Details - #{enquiry.id}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-blue-50 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2 text-blue-600 text-sm">
                                    1
                                </span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500">Full Name:</span>
                                    <p className="font-medium text-gray-900">
                                        {enquiry.firstName} {enquiry.middleName} {enquiry.lastName}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Date of Birth:</span>
                                    <p className="font-medium text-gray-900">{enquiry.dateOfBirth}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Gender:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.gender}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Marital Status:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.maritalStatus}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Mother Tongue:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.motherTongue}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Aadhar Number:</span>
                                    <p className="font-medium text-gray-900">{formatAadhar(enquiry.aadharNumber)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-green-50 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2 text-green-600 text-sm">
                                    2
                                </span>
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <span className="text-sm text-gray-500">Address:</span>
                                    <p className="font-medium text-gray-900">{enquiry.correspondenceAddress}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">City:</span>
                                    <p className="font-medium text-gray-900">{enquiry.city}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">District:</span>
                                    <p className="font-medium text-gray-900">{enquiry.district}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">State:</span>
                                    <p className="font-medium text-gray-900">{enquiry.state}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-yellow-50 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 text-yellow-600 text-sm">
                                    3
                                </span>
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500">Mobile Number:</span>
                                    <p className="font-medium text-gray-900">+91 {enquiry.mobileNumber}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Alternate Mobile:</span>
                                    <p className="font-medium text-gray-900">
                                        {enquiry.alternateMobileNumber ? `+91 ${enquiry.alternateMobileNumber}` : 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Course Information */}
                        <div className="bg-purple-50 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2 text-purple-600 text-sm">
                                    4
                                </span>
                                Course & Educational Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500">Category:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.category?.replace('-', ' ')}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Educational Qualification:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.educationalQualification}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Course Name:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.courseName?.replace('-', ' ')}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Preferred Timing:</span>
                                    <p className="font-medium text-gray-900 capitalize">{enquiry.timing}</p>
                                </div>
                            </div>
                        </div>

                        {/* Submission Details */}
                        <div className="bg-gray-50 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submission Details</h3>
                            <div>
                                <span className="text-sm text-gray-500">Submitted On:</span>
                                <p className="font-medium text-gray-900">{formatDate(enquiry.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                            Close Details
                        </button>
                        <button
                            onClick={onConvertToAdmission}
                            className="bg-green-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                            Convert to Admission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnquiryDetailsModal; 