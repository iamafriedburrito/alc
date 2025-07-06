import React, { useState, useEffect } from "react";
import ErrorFallback from "./ErrorFallback";
import { List, GraduationCap, UserCheck, Plus, RefreshCw, Search, Eye } from "lucide-react";
import { Link } from "react-router";
import { toast } from 'react-toastify';

const StudentAdmissionsList = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCourse, setFilterCourse] = useState("");

    const API_BASE = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/admissions`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAdmissions(data.admissions || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching admissions:", err);
            setError(
                "Failed to fetch admissions. Please check if the server is running.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (admissionId) => {
        try {
            const response = await fetch(
                `${API_BASE}/admission/${admissionId}`,
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedAdmission(data);
        } catch (err) {
            console.error("Error fetching admission details:", err);
            alert("Failed to fetch admission details.");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAadhar = (aadharNumber) => {
        return aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
    };

    // Filter admissions based on search term and course
    const filteredAdmissions = admissions.filter((admission) => {
        const matchesSearch =
            admission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admission.mobileNumber.includes(searchTerm) ||
            admission.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admission.certificateName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesCourse =
            filterCourse === "" || admission.courseName === filterCourse;

        return matchesSearch && matchesCourse;
    });

    const handleRefresh = async () => {
        await fetchAdmissions();
        toast.success('Student list refreshed!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xs rounded-3xl shadow-sm p-8 border border-white/20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading admissions...</p>
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
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-white/20">
                    {/* Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2 md:mb-4 text-left md:text-left">
                                Students List
                            </h2>
                            <div className="inline-flex items-center gap-3 bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-2 shadow-sm text-base font-medium text-blue-900">
                                <span className="text-blue-500">
                                    <GraduationCap className="h-5 w-5" />
                                </span>
                                <span>
                                    <span className="font-semibold">Total:</span> {admissions.length}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span>
                                    <span className="font-semibold">Showing:</span> {filteredAdmissions.length}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/admission"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                            >
                                <Plus className="w-5 h-5" />
                                New Admission
                            </Link>
                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 transition-all duration-200 ease-in-out"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Refresh Data
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="search"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Search Students
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name, mobile, course, or certificate..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="courseFilter"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Filter by Course
                                </label>
                                <select
                                    id="courseFilter"
                                    value={filterCourse}
                                    onChange={(e) => setFilterCourse(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
                                >
                                    <option value="">All Courses</option>
                                    {[
                                        ...new Set(
                                            admissions.map((admission) => admission.courseName),
                                        ),
                                    ].map((course) => (
                                        <option key={course} value={course}>
                                            {course.replace("-", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Admissions List */}
                    {filteredAdmissions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Admissions Found
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || filterCourse
                                    ? "Try adjusting your search or filter criteria."
                                    : "No student admissions have been recorded yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredAdmissions.map((admission) => (
                                <div
                                    key={admission.id}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 font-semibold">
                                                    {admission.id}
                                                </span>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {admission.firstName} {admission.middleName}{" "}
                                                    {admission.lastName}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <span className="text-sm text-gray-500">Course:</span>
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {admission.courseName.replace("-", " ")}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">Mobile:</span>
                                                    <p className="font-medium text-gray-900">
                                                        +91 {admission.mobileNumber}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Admission Date:
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(admission.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 md:ml-6">
                                            <button
                                                onClick={() => handleViewDetails(admission.id)}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-sm flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                </div>

                {/* Modal for Detailed View */}
                {selectedAdmission && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Student Details - #{selectedAdmission.id}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedAdmission(null)}
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
                                                <span className="text-sm text-gray-500">
                                                    Full Name:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.firstName}{" "}
                                                    {selectedAdmission.middleName}{" "}
                                                    {selectedAdmission.lastName}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Date of Birth:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.dateOfBirth}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Gender:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.gender}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Marital Status:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.maritalStatus}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Mother Tongue:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.motherTongue}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Aadhar Number:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {formatAadhar(selectedAdmission.aadharNumber)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Uploaded Documents */}
                                    <div className="bg-pink-50 p-6 rounded-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center mr-2 text-pink-600 text-sm">
                                                2
                                            </span>
                                            Uploaded Documents
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-500">Photo:</span>
                                                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden w-40 h-40">
                                                    <img
                                                        src={`${API_BASE.replace('/api', '')}/uploads/${selectedAdmission.photoFilename}`}
                                                        alt="Student Photo"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Signature:
                                                </span>
                                                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden w-40 h-20">
                                                    <img
                                                        src={`${API_BASE.replace('/api', '')}/uploads/${selectedAdmission.signatureFilename}`}
                                                        alt="Signature"
                                                        className="object-contain w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div className="bg-green-50 p-6 rounded-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2 text-green-600 text-sm">
                                                3
                                            </span>
                                            Address Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <span className="text-sm text-gray-500">Address:</span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.correspondenceAddress}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">City:</span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.city}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">District:</span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.district}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">State:</span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.state}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-yellow-50 p-6 rounded-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 text-yellow-600 text-sm">
                                                4
                                            </span>
                                            Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Mobile Number:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    +91 {selectedAdmission.mobileNumber}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Alternate Mobile:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.alternateMobileNumber
                                                        ? `+91 ${selectedAdmission.alternateMobileNumber}`
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Joined WhatsApp:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.joinedWhatsApp ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course & Admission Information */}
                                    <div className="bg-purple-50 p-6 rounded-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2 text-purple-600 text-sm">
                                                5
                                            </span>
                                            Course & Admission Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Course Name:
                                                </span> <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.courseName?.replace("-", " ")}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Certificate Name:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.certificateName}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Category:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.category}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Educational Qualification:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.educationalQualification}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Preferred Timing:
                                                </span>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedAdmission.timing}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Referred By:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {selectedAdmission.referredBy || "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submission Details */}
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Submission Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Admission Date:
                                                </span>
                                                <p className="font-medium text-gray-900">
                                                    {formatDate(selectedAdmission.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setSelectedAdmission(null)}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-sm"
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

export default StudentAdmissionsList;
