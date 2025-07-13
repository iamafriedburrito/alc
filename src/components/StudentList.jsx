import React, { useState, useEffect } from "react";
import ErrorFallback from "./ErrorFallback";
import { GraduationCap, Plus, RefreshCw, Search, Eye, Edit2 } from "lucide-react";
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
        fetchAdmissions();
        // Attach fetchAdmissions to window for handleRefresh
        window._fetchAdmissions = fetchAdmissions;
    }, [API_BASE]);

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
        if (window._fetchAdmissions) {
            await window._fetchAdmissions();
            toast.success('Student list refreshed!');
        }
    };

    // Close modal on Escape key press
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                setSelectedAdmission(null);
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

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
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-white/20 mb-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Students List</h1>
                        <p className="text-gray-600 text-lg">View, search, and manage student admissions</p>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-1 gap-3">
                            <div className="relative w-full max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, mobile, course, or certificate..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white text-sm h-12"
                                />
                            </div>
                            <select
                                id="courseFilter"
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                className="w-full max-w-xs px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white text-sm h-12"
                            >
                                <option value="">All Courses</option>
                                {[...new Set(admissions.map((admission) => admission.courseName))].map((course) => (
                                    <option key={course} value={course}>
                                        {course.replace("-", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3 text-sm font-medium text-blue-900 h-12">
                                <GraduationCap className="w-4 h-4 text-blue-500" />
                                <span>Total: <span className="font-semibold">{admissions.length}</span></span>
                            </div>
                            <Link
                                to="/admission"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out h-12"
                            >
                                <Plus className="w-5 h-5" />
                                New Admission
                            </Link>
                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 transition-all duration-200 ease-in-out h-12"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Refresh Data
                            </button>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredAdmissions.map((admission) => (
                            <div
                                key={admission.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center transition-all duration-200 h-full hover:shadow-md"
                            >
                                <img
                                    src={`${API_BASE.replace('/api', '')}/uploads/${admission.photoFilename}`}
                                    alt={admission.firstName + ' ' + admission.lastName}
                                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-white shadow-sm"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Photo';
                                    }}
                                />
                                <div className="text-lg font-semibold text-gray-900 text-center mb-1 min-h-[3rem] flex items-center justify-center">
                                    {admission.firstName} {admission.middleName || ''} {admission.lastName}
                                </div>
                                <div className="text-sm text-gray-600 mb-2 text-center capitalize">{admission.courseName.replace('-', ' ')}</div>
                                <div className="text-sm text-gray-500 mb-2 text-center">+91 {admission.mobileNumber}</div>
                                <div className="text-xs text-gray-400 mb-4 text-center">Admission: {formatDate(admission.createdAt)}</div>
                                <div className="mt-auto w-full flex flex-col gap-2">
                                    <button
                                        onClick={() => handleViewDetails(admission.id)}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 justify-center"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <Link
                                        to={`/admissions/edit/${admission.id}`}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 justify-center"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </Link>
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
    );
};

export default StudentAdmissionsList;
