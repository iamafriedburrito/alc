import React from "react";

const ErrorFallback = ({ onRetry }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/20">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
                        <p className="text-gray-600 mb-4">Failed to fetch data. Please check if the server is running.</p>
                        <button
                            onClick={onRetry}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;

