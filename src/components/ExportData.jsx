import { useState } from "react";
import { Download, Users, FileText, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const ExportData = () => {
    const [exporting, setExporting] = useState({});

    const handleExport = async (type) => {
        if (exporting[type]) return;

        setExporting((prev) => ({ ...prev, [type]: true }));

        try {
            toast.info("Preparing export...");

            // Simulate export process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast.success(`${type} data exported successfully!`);
        } catch (error) {
            toast.error(`Export failed: ${error.message}`);
        } finally {
            setExporting((prev) => ({ ...prev, [type]: false }));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Download className="w-6 h-6 mr-3 text-blue-600" />
                Export Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Students Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Students Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export all student records
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Student")}
                            disabled={exporting.students}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.students ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Students</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Enquiries Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Enquiries Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export all enquiry records
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Enquiries")}
                            disabled={exporting.enquiries}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.enquiries ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Enquiries</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Fees Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-8 h-8 text-purple-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Fee Records
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export payment history
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Fees")}
                            disabled={exporting.fees}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.fees ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Fee Records</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Attendance Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-orange-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Attendance Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export attendance records
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Attendance")}
                            disabled={exporting.attendance}
                            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.attendance ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Attendance</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Followups Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Followups Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export followup records
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Followups")}
                            disabled={exporting.followups}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.followups ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Followups</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Courses Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-8 h-8 text-teal-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Courses Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export course records
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Course")}
                            disabled={exporting.courses}
                            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.courses ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Courses</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Documents Export */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-8 h-8 text-pink-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Documents Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Export document records
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={() => handleExport("Documents")}
                            disabled={exporting.documents}
                            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {exporting.documents ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Export Documents</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportData;
