import React, { useState, useEffect } from "react";
import {
    Search,
    Phone,
    Calendar,
    BookOpen,
    Clock,
    Plus,
    Eye,
    Users,
    RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import ErrorFallback from "./ErrorFallback";
import { Link, useNavigate } from "react-router";
import EnquiryDetailsModal from "./modals/EnquiryDetailsModal";
import FollowupModal from "./modals/FollowupModal";
import { formatDate, getStatusColor, getStatusIcon } from "./utils.jsx";

const StudentEnquiriesList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [followupData, setFollowupData] = useState({
        followup_date: "",
        notes: "",
        status: "PENDING",
        next_followup_date: "",
        handled_by: "System User",
    });
    const [followupEnquiry, setFollowupEnquiry] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const enquiriesPerPage = 12;

    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch enquiries, tracker data, and all follow-ups
            const [enquiriesResponse, followupsResponse, allFollowupsResponse] =
                await Promise.all([
                    fetch(`${API_BASE}/enquiries`),
                    fetch(`${API_BASE}/followups/tracker`),
                    fetch(`${API_BASE}/followups`),
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
            const mergedData =
                followupsData.length > 0 ? followupsData : enquiriesData;

            // Update each enquiry with its latest follow-up status
            const enrichedData = mergedData.map((enquiry) => {
                // Find the latest follow-up for this enquiry
                const enquiryFollowups = allFollowupsData
                    .filter((followup) => followup.enquiry_id === enquiry.id)
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    );

                const latestFollowup = enquiryFollowups[0];

                return {
                    ...enquiry,
                    // Use the latest follow-up status if available, otherwise use currentStatus
                    currentStatus: latestFollowup
                        ? latestFollowup.status
                        : enquiry.currentStatus,
                    latestFollowupDate: latestFollowup
                        ? latestFollowup.followup_date
                        : null,
                    latestNotes: latestFollowup
                        ? latestFollowup.notes
                        : enquiry.latestNotes,
                    nextFollowup: latestFollowup
                        ? latestFollowup.next_followup_date
                        : enquiry.nextFollowup,
                };
            });

            setEnquiries(enrichedData);
            setFilteredEnquiries(enrichedData);
        } catch (err) {
            console.error("Error fetching enquiries:", err);
            setError(
                "Failed to fetch enquiries. Please check if the server is running.",
            );
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
            followup_date: new Date().toISOString().split("T")[0],
            notes: "",
            status: enquiry.currentStatus || "PENDING",
            next_followup_date: enquiry.nextFollowup || "",
            handled_by: "System User",
        });
    };

    const handleFollowupSubmit = async (e) => {
        e.preventDefault();

        if (!followupData.followup_date) {
            alert("Please select a follow-up date");
            return;
        }

        try {
            setSubmitting(true);

            const submitData = {
                enquiry_id: followupEnquiry.id,
                followup_date: followupData.followup_date,
                status: followupData.status,
                notes: followupData.notes || "",
                next_followup_date: followupData.next_followup_date || null,
                handled_by: followupData.handled_by,
            };

            const response = await fetch(`${API_BASE}/followup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.detail || "Failed to save follow-up",
                    );
                } else {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: Server error`);
                }
            }

            const result = await response.json();
            console.log("Follow-up saved successfully:", result);

            await fetchEnquiries();
            setShowFollowupModal(false);
            setFollowupEnquiry(null);
            toast.success("Follow-up recorded successfully!");
        } catch (error) {
            console.error("Error recording follow-up:", error);
            alert(`Error recording follow-up: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter enquiries based on search term, category, and status
    useEffect(() => {
        let filtered = enquiries;

        if (searchTerm) {
            filtered = filtered.filter(
                (enquiry) =>
                    enquiry.firstName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enquiry.lastName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enquiry.mobileNumber?.includes(searchTerm) ||
                    enquiry.courseName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enquiry.id?.toString().includes(searchTerm),
            );
        }

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(
                (enquiry) => enquiry.currentStatus === statusFilter,
            );
        }

        setFilteredEnquiries(filtered);
    }, [searchTerm, statusFilter, enquiries]);

    // Pagination logic
    const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);
    const paginatedEnquiries = filteredEnquiries.slice(
        (currentPage - 1) * enquiriesPerPage,
        currentPage * enquiriesPerPage,
    );

    // Reset to page 1 when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

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
        toast.success("Enquiries list refreshed!");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xs rounded-3xl shadow-sm p-8 border border-white/20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Loading enquiries...
                            </p>
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Enquiries List
                        </h1>
                        <p className="text-gray-600 text-lg">
                            View, search, and manage student enquiries and
                            follow-ups
                        </p>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-1 gap-3">
                            {/* Make search input wider and status filter narrower */}
                            <div className="relative flex-[2] w-full max-w-2xl">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Search by name, mobile, course, or ID..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white text-sm h-12"
                                />
                            </div>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="flex-[1] w-full max-w-[180px] px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white text-sm h-12"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="INTERESTED">Interested</option>
                                <option value="NOT_INTERESTED">
                                    Not Interested
                                </option>
                                <option value="ADMITTED">Admitted</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3 text-sm font-medium text-blue-900 h-12">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>
                                    Total:{" "}
                                    <span className="font-semibold">
                                        {enquiries.length}
                                    </span>
                                </span>
                            </div>
                            <Link
                                to="/enquiry"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out h-12"
                            >
                                <Plus className="w-5 h-5" />
                                New Enquiry
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

                {/* Enquiries List */}
                {paginatedEnquiries.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Enquiries Found
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm || statusFilter !== "ALL"
                                ? "Try adjusting your search or filter criteria."
                                : "No student enquiries found in database."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {paginatedEnquiries.map((enquiry) => {
                            const daysOverdue = getDaysOverdue(
                                enquiry.nextFollowup,
                            );
                            const isOverdue = daysOverdue > 0;

                            return (
                                <div
                                    key={enquiry.id}
                                    className={`flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-sm transition-all duration-200 p-6 gap-4 md:gap-0`}
                                    style={{ minHeight: "120px" }}
                                >
                                    {/* Left: Main Info */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <span className="text-lg md:text-xl font-bold text-gray-900 tracking-wide uppercase">
                                                {enquiry.firstName}{" "}
                                                {enquiry.middleName}{" "}
                                                {enquiry.lastName}
                                            </span>
                                            <span
                                                className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.currentStatus)}`}
                                            >
                                                {getStatusIcon(
                                                    enquiry.currentStatus,
                                                )}
                                                <span className="ml-1">
                                                    {enquiry.currentStatus?.replace(
                                                        "_",
                                                        " ",
                                                    ) || "PENDING"}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Left Column: Mobile and Course */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Phone className="w-4 h-4" />
                                                    <span>
                                                        +91{" "}
                                                        {enquiry.mobileNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>
                                                        {enquiry.courseName?.replace(
                                                            "-",
                                                            " ",
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Right Column: Dates */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {enquiry.enquiryDate
                                                            ? `Enquiry: ${enquiry.enquiryDate}`
                                                            : `Submitted: ${formatDate(enquiry.createdAt)}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {enquiry.nextFollowup ? (
                                                            <>
                                                                <span>
                                                                    Next:{" "}
                                                                    {
                                                                        enquiry.nextFollowup
                                                                    }
                                                                </span>
                                                                {isOverdue && (
                                                                    <span className="text-red-600 font-semibold ml-1">
                                                                        (
                                                                        {
                                                                            daysOverdue
                                                                        }{" "}
                                                                        days
                                                                        overdue)
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            "No next follow-up scheduled"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 mt-1">
                                            <span>
                                                Follow-ups:{" "}
                                                <span className="font-semibold text-gray-700">
                                                    {enquiry.followupCount || 0}
                                                </span>
                                            </span>
                                            {enquiry.lastFollowup && (
                                                <span>
                                                    Last:{" "}
                                                    <span className="font-semibold text-gray-700">
                                                        {enquiry.lastFollowup}
                                                    </span>
                                                </span>
                                            )}
                                            {enquiry.latestNotes && (
                                                <span className="italic text-gray-500">
                                                    {enquiry.latestNotes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Right: Actions */}
                                    <div className="flex flex-col md:items-end gap-2 md:gap-3 min-w-[160px] md:pl-6">
                                        <button
                                            onClick={() =>
                                                handleViewDetails(enquiry.id)
                                            }
                                            className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium border border-gray-200 flex items-center gap-2 shadow-sm transition-all duration-150"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        {enquiry.currentStatus !==
                                            "ADMITTED" && (
                                            <button
                                                onClick={() =>
                                                    handleFollowupClick(enquiry)
                                                }
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150"
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

                {/* Add pagination controls below the list */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <nav className="inline-flex rounded-xl shadow-sm overflow-hidden border border-gray-200 bg-white">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`px-4 py-2 text-sm font-medium ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}

                {/* Modal for Detailed View */}
                <EnquiryDetailsModal
                    open={!!selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                    enquiry={selectedEnquiry}
                    onConvertToAdmission={() => {
                        setSelectedEnquiry(null);
                        navigate("/admission", {
                            state: { enquiry: selectedEnquiry },
                        });
                    }}
                />

                {/* Follow-up Modal */}
                <FollowupModal
                    open={showFollowupModal}
                    onClose={() => {
                        setShowFollowupModal(false);
                        setFollowupEnquiry(null);
                    }}
                    enquiry={followupEnquiry}
                    followupData={followupData}
                    setFollowupData={setFollowupData}
                    onSubmit={handleFollowupSubmit}
                    submitting={submitting}
                />
            </div>
        </div>
    );
};

export default StudentEnquiriesList;
