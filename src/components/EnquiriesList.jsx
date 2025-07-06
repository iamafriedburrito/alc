import React, { useState, useEffect } from "react"
import { Search, Phone, Calendar, User, BookOpen, Clock, CheckCircle, AlertCircle, XCircle, Plus, Eye, Users, RefreshCw, Save } from "lucide-react";
import { toast } from "react-toastify";
import ErrorFallback from "./ErrorFallback";
import { Link } from "react-router";

const StudentEnquiriesList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [activeTab, setActiveTab] = useState("followups"); // Only followups tab needed
    const [followupData, setFollowupData] = useState({
        followup_date: "",
        notes: "",
        status: "PENDING",
        next_followup_date: "",
        handled_by: "System User"
    });
    const [followupEnquiry, setFollowupEnquiry] = useState(null);

    const API_BASE = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch enquiries, tracker data, and all follow-ups
            const [enquiriesResponse, followupsResponse, allFollowupsResponse] = await Promise.all([
                fetch(`${API_BASE}/enquiries`),
                fetch(`${API_BASE}/followups/tracker`),
                fetch(`${API_BASE}/followups`)
            ]);

            let enquiriesData = [];
            let followupsData = [];
            let allFollowupsData = [];

            if (enquiriesResponse.ok) {
                const enquiriesResult = await enquiriesResponse.json();
                enquiriesData = enquiriesResult.enquiries || [];
            }

            if (followupsResponse.ok) {
                const followupsResult = await followupsResponse.json();
                followupsData = followupsResult.enquiries || [];
            }

            if (allFollowupsResponse.ok) {
                const allFollowupsResult = await allFollowupsResponse.json();
                allFollowupsData = allFollowupsResult.followups || [];
            }

            // Merge the data - use followups data if available, otherwise use regular enquiries
            const mergedData = followupsData.length > 0 ? followupsData : enquiriesData;
            
            // Update each enquiry with its latest follow-up status
            const enrichedData = mergedData.map(enquiry => {
                // Find the latest follow-up for this enquiry
                const enquiryFollowups = allFollowupsData.filter(followup => 
                    followup.enquiry_id === enquiry.id
                ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                
                const latestFollowup = enquiryFollowups[0];
                
                return {
                    ...enquiry,
                    // Use the latest follow-up status if available, otherwise use currentStatus
                    currentStatus: latestFollowup ? latestFollowup.status : enquiry.currentStatus,
                    latestFollowupDate: latestFollowup ? latestFollowup.followup_date : null,
                    latestNotes: latestFollowup ? latestFollowup.notes : enquiry.latestNotes,
                    nextFollowup: latestFollowup ? latestFollowup.next_followup_date : enquiry.nextFollowup
                };
            });
            
            setEnquiries(enrichedData);
            setFilteredEnquiries(enrichedData);

        } catch (err) {
            console.error("Error fetching enquiries:", err);
            setError("Failed to fetch enquiries. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (enquiryId) => {
        try {
            const response = await fetch(`${API_BASE}/enquiry/${enquiryId}`);

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

    const handleFollowupClick = (enquiry) => {
        setFollowupEnquiry(enquiry);
        setShowFollowupModal(true);
        setFollowupData({
            followup_date: new Date().toISOString().split('T')[0],
            notes: '',
            status: enquiry.currentStatus || 'PENDING',
            next_followup_date: enquiry.nextFollowup || '',
            handled_by: 'System User'
        });
    };

    const handleFollowupSubmit = async (e) => {
        e.preventDefault();

        if (!followupData.followup_date) {
            alert('Please select a follow-up date');
            return;
        }

        try {
            setSubmitting(true);

            const submitData = {
                enquiry_id: followupEnquiry.id,
                followup_date: followupData.followup_date,
                status: followupData.status,
                notes: followupData.notes || '',
                next_followup_date: followupData.next_followup_date || null,
                handled_by: followupData.handled_by
            };

            const response = await fetch(`${API_BASE}/followup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to save follow-up');
                } else {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: Server error`);
                }
            }

            const result = await response.json();
            console.log('Follow-up saved successfully:', result);

            await fetchEnquiries();
            setShowFollowupModal(false);
            setFollowupEnquiry(null);
            toast.success('Follow-up recorded successfully!');

        } catch (error) {
            console.error('Error recording follow-up:', error);
            alert(`Error recording follow-up: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter enquiries based on search term, category, and status
    useEffect(() => {
        let filtered = enquiries;

        if (searchTerm) {
            filtered = filtered.filter(enquiry =>
                enquiry.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enquiry.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enquiry.mobileNumber?.includes(searchTerm) ||
                enquiry.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enquiry.id?.toString().includes(searchTerm)
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(enquiry => enquiry.currentStatus === statusFilter);
        }

        setFilteredEnquiries(filtered);
    }, [searchTerm, statusFilter, enquiries]);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'INTERESTED': return 'bg-green-100 text-green-800 border-green-200';
            case 'NOT_INTERESTED': return 'bg-red-100 text-red-800 border-red-200';
            case 'ADMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <AlertCircle className="w-4 h-4" />;
            case 'INTERESTED': return <CheckCircle className="w-4 h-4" />;
            case 'NOT_INTERESTED': return <XCircle className="w-4 h-4" />;
            case 'ADMITTED': return <BookOpen className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getDaysOverdue = (nextFollowupDate) => {
        if (!nextFollowupDate) return 0;
        const today = new Date();
        const followupDate = new Date(nextFollowupDate);
        const diffTime = today - followupDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleRefresh = async () => {
        await fetchEnquiries();
        toast.success('Enquiries list refreshed!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xs rounded-3xl shadow-xl p-8 border border-white/20">
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
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/20">
                    {/* Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2 md:mb-4 text-left md:text-left">
                                Enquiries
                            </h2>
                            <div className="inline-flex items-center gap-3 bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-2 shadow-sm text-base font-medium text-blue-900">
                                <span className="text-blue-500">
                                    <Users className="h-5 w-5" />
                                </span>
                                <span>
                                    <span className="font-semibold">Total:</span> {enquiries.length}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span>
                                    <span className="font-semibold">Showing:</span> {filteredEnquiries.length}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/enquiry"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                            >
                                <Plus className="w-5 h-5" />
                                New Enquiry
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
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Enquiries
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-500 z-10" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name, mobile, course, or ID..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="INTERESTED">Interested</option>
                                    <option value="NOT_INTERESTED">Not Interested</option>
                                    <option value="ADMITTED">Admitted</option>
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
                                {searchTerm || statusFilter !== "ALL" ? "Try adjusting your search or filter criteria." : "No student enquiries found in database."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredEnquiries.map((enquiry) => {
                                const daysOverdue = getDaysOverdue(enquiry.nextFollowup);
                                const isOverdue = daysOverdue > 0;

                                return (
                                    <div
                                        key={enquiry.id}
                                        className={`flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-all duration-200 p-6 gap-4 md:gap-0`}
                                        style={{ minHeight: '120px' }}
                                    >
                                        {/* Left: Main Info */}
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <span className="text-lg md:text-xl font-bold text-gray-900 tracking-wide uppercase">
                                                    {enquiry.firstName} {enquiry.middleName} {enquiry.lastName}
                                                </span>
                                                <span className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.currentStatus)}`}
                                                >
                                                    {getStatusIcon(enquiry.currentStatus)}
                                                    <span className="ml-1">{enquiry.currentStatus?.replace('_', ' ') || 'PENDING'}</span>
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Left Column: Mobile and Course */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <Phone className="w-4 h-4" />
                                                        <span>+91 {enquiry.mobileNumber}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <BookOpen className="w-4 h-4" />
                                                        <span>{enquiry.courseName?.replace('-', ' ')}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Right Column: Dates */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{enquiry.enquiryDate ? `Enquiry: ${enquiry.enquiryDate}` : `Submitted: ${formatDate(enquiry.createdAt)}`}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{enquiry.nextFollowup ? (<><span>Next: {enquiry.nextFollowup}</span>{isOverdue && <span className="text-red-600 font-semibold ml-1">({daysOverdue} days overdue)</span>}</>) : 'No next follow-up scheduled'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 mt-1">
                                                <span>Follow-ups: <span className="font-semibold text-gray-700">{enquiry.followupCount || 0}</span></span>
                                                {enquiry.lastFollowup && (
                                                    <span>Last: <span className="font-semibold text-gray-700">{enquiry.lastFollowup}</span></span>
                                                )}
                                                {enquiry.latestNotes && (
                                                    <span className="italic text-gray-500">{enquiry.latestNotes}</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Right: Actions */}
                                        <div className="flex flex-col md:items-end gap-2 md:gap-3 min-w-[160px] md:pl-6">
                                            <button
                                                onClick={() => handleViewDetails(enquiry.id)}
                                                className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium border border-gray-200 flex items-center gap-2 shadow-sm transition-all duration-150"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            {enquiry.currentStatus !== 'ADMITTED' && (
                                                <button
                                                    onClick={() => handleFollowupClick(enquiry)}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Follow-up
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                </div>

                {/* Modal for Detailed View */}
                {selectedEnquiry && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
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
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.category?.replace('-', ' ')}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Educational Qualification:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.educationalQualification}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Course Name:</span>
                                                <p className="font-medium text-gray-900 capitalize">{selectedEnquiry.courseName?.replace('-', ' ')}</p>
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

                {/* Follow-up Modal */}
                {showFollowupModal && followupEnquiry && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Add Follow-up
                                    </h3>
                                    <p className="text-gray-600">
                                        {followupEnquiry?.firstName} {followupEnquiry?.lastName} (ID: {followupEnquiry?.id})
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Follow-up Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={followupData.followup_date}
                                            onChange={(e) => setFollowupData({ ...followupData, followup_date: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status *
                                            </label>
                                            <select
                                                value={followupData.status}
                                                onChange={(e) => setFollowupData({ ...followupData, status: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="INTERESTED">Interested</option>
                                                <option value="NOT_INTERESTED">Not Interested</option>
                                                <option value="ADMITTED">Admitted</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Next Follow-up Date
                                            </label>
                                            <input
                                                type="date"
                                                value={followupData.next_followup_date}
                                                onChange={(e) => setFollowupData({ ...followupData, next_followup_date: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes
                                        </label>
                                        <input
                                            type="text"
                                            value={followupData.notes}
                                            onChange={(e) => setFollowupData({ ...followupData, notes: e.target.value })}
                                            placeholder="Add notes about the follow-up..."
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Handled By *
                                        </label>
                                        <input
                                            type="text"
                                            value={followupData.handled_by}
                                            onChange={(e) => setFollowupData({ ...followupData, handled_by: e.target.value })}
                                            required
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleFollowupSubmit}
                                            disabled={submitting}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            {submitting ? 'Saving...' : 'Save Follow-up'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowFollowupModal(false); setFollowupEnquiry(null); }}
                                            disabled={submitting}
                                            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    </div>
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
