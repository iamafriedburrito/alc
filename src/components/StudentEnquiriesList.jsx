import React, { useState, useEffect } from "react";
import ErrorFallback from "./ErrorFallback";

const StudentEnquiriesList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/enquiries');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEnquiries(data.enquiries || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching enquiries:", err);
            setError("Failed to fetch enquiries. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (enquiryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/enquiry/${enquiryId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedEnquiry(data);
        } catch (err) {
            console.error("Error fetching enquiry details:", err);
            alert("Failed to fetch enquiry details.");
        }
    };

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
        return aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    };

    // Filter enquiries based on search term and category
    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch =
            enquiry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.mobileNumber.includes(searchTerm) ||
            enquiry.courseName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === "" || enquiry.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading enquiries...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorFallback onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Student Enquiries
                        </h2>
                        <p className="text-gray-600">
                            Total enquiries: {enquiries.length} | Showing: {filteredEnquiries.length}
                        </p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Enquiries
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, mobile, or course..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Category
                                </label>
                                <select
                                    id="categoryFilter"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                >
                                    <option value="">All Categories</option>
                                    <option value="school-student">School Student</option>
                                    <option value="college-student">College Student</option>
                                    <option value="govt-employee">Government Employee</option>
                                    <option value="housewife">Housewife</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Enquiries List */}
                    {filteredEnquiries.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Enquiries Found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterCategory ? "Try adjusting your search or filter criteria." : "No student enquiries have been submitted yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredEnquiries.map((enquiry) => (
                                <div key={enquiry.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 font-semibold">
                                                    {enquiry.id}
                                                </span>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {enquiry.firstName} {enquiry.middleName} {enquiry.lastName}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <span className="text-sm text-gray-500">Course:</span>
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {enquiry.courseName.replace('-', ' ')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">Mobile:</span>
                                                    <p className="font-medium text-gray-900">+91 {enquiry.mobileNumber}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">Category:</span>
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {enquiry.category.replace('-', ' ')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-sm text-gray-500">Location:</span>
                                                    <p className="font-medium text-gray-900">
                                                        {enquiry.city}, {enquiry.district}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">Submitted:</span>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(enquiry.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 md:ml-6">
                                            <button
                                                onClick={() => handleViewDetails(enquiry.id)}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Refresh Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={fetchEnquiries}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-all duration-200 ease-in-out border border-gray-200"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Modal for Detailed View */}
                {selectedEnquiry && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Enquiry Details - #{selectedEnquiry.id}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedEnquiry(null)}
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
                                                    {selectedEnquiry.firstName} {selectedEnquiry.middleName} {selectedEnquiry.lastName}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Date of Birth:</span>
                                                <p className="font-medium text-gray-900">{selectedEnquiry.dateOfBirth}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Gender:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.gender}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Marital Status:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.maritalStatus}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Mother Tongue:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.motherTongue}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Aadhar Number:</span>
                                                <p className="font-medium text-gray-900">{formatAadhar(selectedEnquiry.aadharNumber)}</p>
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
                                                <p className="font-medium text-gray-900">{selectedEnquiry.correspondenceAddress}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">City:</span>
                                                <p className="font-medium text-gray-900">{selectedEnquiry.city}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">District:</span>
                                                <p className="font-medium text-gray-900">{selectedEnquiry.district}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">State:</span>
                                                <p className="font-medium text-gray-900">{selectedEnquiry.state}</p>
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
                                                <p className="font-medium text-gray-900">+91 {selectedEnquiry.mobileNumber}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Alternate Mobile:</span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedEnquiry.alternateMobileNumber ? `+91 ${selectedEnquiry.alternateMobileNumber}` : 'Not provided'}
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
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.category.replace('-', ' ')}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Educational Qualification:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.educationalQualification}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Course Name:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.courseName.replace('-', ' ')}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Preferred Timing:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.timing}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submission Details */}
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Submission Details</h3>
                                        <div>
                                            <span className="text-sm text-gray-500">Submitted On:</span>
                                            <p className="font-medium text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setSelectedEnquiry(null)}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentEnquiriesList;
