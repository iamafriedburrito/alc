import React from "react";
import {
    Database,
    FileText,
    Clock,
    Shield,
    Download,
    Loader2,
    Upload,
    AlertCircle,
    HardDrive,
    RefreshCw
} from "lucide-react";

const DatabaseManagement = ({
    dbStats,
    formatFileSize,
    formatDate,
    createBackup,
    backupInProgress,
    restoreInProgress,
    backupFileInputRef,
    handleBackupFileChange
}) => {
    return (
        <div className="space-y-8">
            {/* Database Statistics */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <HardDrive className="w-6 h-6 mr-3 text-purple-600" />
                    Database Statistics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Database Size</p>
                                <p className="text-2xl font-bold text-blue-700">{formatFileSize(dbStats.databaseSize)}</p>
                            </div>
                            <Database className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Total Records</p>
                                <p className="text-2xl font-bold text-green-700">{dbStats.totalRecords}</p>
                            </div>
                            <FileText className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Last Backup</p>
                                <p className="text-sm font-bold text-orange-700">{formatDate(dbStats.lastBackup)}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Backup & Restore Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-green-600" />
                    Backup & Restore
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Backup */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Create Backup</h3>
                        <p className="text-gray-600">
                            Create a complete backup of your database including all student records, admissions, and settings.
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div className="text-sm text-yellow-700">
                                    <p className="font-medium">Important:</p>
                                    <ul className="mt-1 list-disc list-inside space-y-1">
                                        <li>Regular backups are recommended</li>
                                        <li>Store backups in a secure location</li>
                                        <li>Backup process may take a few minutes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={createBackup}
                            disabled={backupInProgress}
                            className="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            {backupInProgress ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            <span>{backupInProgress ? 'Creating Backup...' : 'Create Backup'}</span>
                        </button>
                    </div>

                    {/* Restore Backup */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Restore Backup</h3>
                        <p className="text-gray-600">
                            Restore your database from a previously created backup file.
                        </p>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div className="text-sm text-red-700">
                                    <p className="font-medium">Warning:</p>
                                    <ul className="mt-1 list-disc list-inside space-y-1">
                                        <li>This will replace ALL current data</li>
                                        <li>Create a backup before restoring</li>
                                        <li>Process cannot be undone</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={backupFileInputRef}
                            onChange={handleBackupFileChange}
                            accept=".sql,.db,.backup"
                            className="hidden"
                        />

                        <button
                            onClick={() => backupFileInputRef.current?.click()}
                            disabled={restoreInProgress}
                            className="w-full px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            {restoreInProgress ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            <span>{restoreInProgress ? 'Restoring...' : 'Restore Backup'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Backup History */}
            {dbStats.backupHistory && dbStats.backupHistory.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-white/20">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                        <RefreshCw className="w-6 h-6 mr-3 text-blue-600" />
                        Recent Backups
                    </h2>

                    <div className="space-y-3">
                        {dbStats.backupHistory.map((backup, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Database className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{backup.filename}</p>
                                        <p className="text-sm text-gray-500">{formatDate(backup.created)} • {formatFileSize(backup.size)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${backup.status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {backup.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatabaseManagement; 