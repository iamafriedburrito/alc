import React, { useEffect } from "react";
import { Save } from "lucide-react";

const FollowupModal = ({
    open,
    onClose,
    enquiry,
    followupData,
    setFollowupData,
    onSubmit,
    submitting,
}) => {
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
            <div className="bg-white rounded-3xl shadow-sm max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Add Follow-up
                        </h3>
                        <p className="text-gray-600">
                            {enquiry?.firstName} {enquiry?.lastName} (ID:{" "}
                            {enquiry?.id})
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
                                onChange={(e) =>
                                    setFollowupData({
                                        ...followupData,
                                        followup_date: e.target.value,
                                    })
                                }
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        {followupData.status !== "ADMITTED" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        value={followupData.status}
                                        onChange={(e) =>
                                            setFollowupData({
                                                ...followupData,
                                                status: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="INTERESTED">
                                            Interested
                                        </option>
                                        <option value="NOT_INTERESTED">
                                            Not Interested
                                        </option>
                                        <option value="ADMITTED">
                                            Admitted
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Next Follow-up Date
                                    </label>
                                    <input
                                        type="date"
                                        value={followupData.next_followup_date}
                                        onChange={(e) =>
                                            setFollowupData({
                                                ...followupData,
                                                next_followup_date:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={followupData.status}
                                    onChange={(e) =>
                                        setFollowupData({
                                            ...followupData,
                                            status: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="INTERESTED">
                                        Interested
                                    </option>
                                    <option value="NOT_INTERESTED">
                                        Not Interested
                                    </option>
                                    <option value="ADMITTED">Admitted</option>
                                </select>
                            </div>
                        )}
                        {followupData.status !== "ADMITTED" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <input
                                    type="text"
                                    value={followupData.notes}
                                    onChange={(e) =>
                                        setFollowupData({
                                            ...followupData,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Add notes about the follow-up..."
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Handled By *
                            </label>
                            <input
                                type="text"
                                value={followupData.handled_by}
                                onChange={(e) =>
                                    setFollowupData({
                                        ...followupData,
                                        handled_by: e.target.value,
                                    })
                                }
                                required
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={onSubmit}
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {submitting ? "Saving..." : "Save Follow-up"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
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
    );
};

export default FollowupModal;
