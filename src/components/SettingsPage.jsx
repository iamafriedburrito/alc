import { useState, useEffect, useRef } from 'react'
import {
    Building2,
    Image,
    Database,
    Download,
    Upload,
    Save,
    AlertCircle,
    Loader2,
    FileText,
    Shield,
    Clock,
    HardDrive,
    RefreshCw,
    Camera,
    X
} from "lucide-react"
import { toast } from 'react-toastify'
import ErrorFallback from './ErrorFallback'

const SettingsPage = () => {
    const fileInputRef = useRef(null)
    const backupFileInputRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [backupInProgress, setBackupInProgress] = useState(false)
    const [restoreInProgress, setRestoreInProgress] = useState(false)

    // Institute Settings State
    const [instituteSettings, setInstituteSettings] = useState({
        name: '',
        logo: null,
        logoPreview: null,
        address: '',
        phone: '',
        email: '',
        website: ''
    })

    // Database Settings State
    const [dbStats, setDbStats] = useState({
        lastBackup: null,
        databaseSize: 0,
        totalRecords: 0,
        backupHistory: []
    })

    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('institute')

    // API base URL
    const API_BASE = import.meta.env.VITE_API_URL

    // Fetch current settings
    const fetchSettings = async () => {
        setError(null)
        try {
            setLoading(true)

            const [instituteResponse, dbStatsResponse] = await Promise.all([
                fetch(`${API_BASE}/settings/institute`).catch(() => ({ ok: false })),
                fetch(`${API_BASE}/settings/database/stats`).catch(() => ({ ok: false }))
            ])

            // If either response is not OK, show error fallback
            if (!instituteResponse.ok || !dbStatsResponse.ok) {
                setError('Failed to load settings. Please check your connection.')
                setLoading(false)
                return
            }

            const instituteData = await instituteResponse.json()
            setInstituteSettings({
                name: instituteData.name || '',
                address: instituteData.address || '',
                phone: instituteData.phone || '',
                email: instituteData.email || '',
                website: instituteData.website || '',
                logo: null,
                logoPreview: instituteData.logo ? `${API_BASE.replace('/api', '')}/uploads/${instituteData.logo}` : null
            })

            const dbData = await dbStatsResponse.json()
            setDbStats(dbData)

        } catch (err) {
            console.error('Error fetching settings:', err)
            setError('Failed to load settings. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    // Handle logo file selection
    const handleLogoChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Logo file size should be less than 5MB')
                return
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file')
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                setInstituteSettings(prev => ({
                    ...prev,
                    logo: file,
                    logoPreview: e.target.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove logo
    const removeLogo = () => {
        setInstituteSettings(prev => ({
            ...prev,
            logo: null,
            logoPreview: null
        }))
    }

    // Save institute settings
    const saveInstituteSettings = async () => {
        try {
            setSaving(true)

            const formData = new FormData()
            formData.append('name', instituteSettings.name)
            formData.append('address', instituteSettings.address)
            formData.append('phone', instituteSettings.phone)
            formData.append('email', instituteSettings.email)
            formData.append('website', instituteSettings.website)

            if (instituteSettings.logo instanceof File) {
                formData.append('logo', instituteSettings.logo)
            }

            const response = await fetch(`${API_BASE}/settings/institute`, {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const result = await response.json()
                toast.success(result.message || 'Institute settings saved successfully!')
                fetchSettings() // Refresh settings
            } else {
                const errorData = await response.json()
                toast.error(errorData.detail || 'Failed to save settings')
            }

        } catch (err) {
            console.error('Error saving settings:', err)
            toast.error('Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    // Database backup
    const createBackup = async () => {
        try {
            setBackupInProgress(true)

            const response = await fetch(`${API_BASE}/settings/database/backup`, {
                method: 'POST'
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url

                // Get filename from response headers or use default
                const contentDisposition = response.headers.get('content-disposition')
                let filename = `edumanage_backup_${new Date().toISOString().split('T')[0]}.sql`

                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
                    if (filenameMatch) {
                        filename = filenameMatch[1]
                    }
                }

                a.download = filename
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)

                toast.success('Database backup created successfully!')
                fetchSettings() // Refresh stats
            } else {
                const errorData = await response.json()
                toast.error(errorData.detail || 'Failed to create backup')
            }

        } catch (err) {
            console.error('Error creating backup:', err)
            toast.error('Failed to create backup. Please try again.')
        } finally {
            setBackupInProgress(false)
        }
    }

    // Database restore
    const restoreBackup = async (file) => {
        try {
            setRestoreInProgress(true)

            const formData = new FormData()
            formData.append('backup_file', file)

            const response = await fetch(`${API_BASE}/settings/database/restore`, {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const result = await response.json()
                toast.success(result.message || 'Database restored successfully!')
                fetchSettings() // Refresh stats
                // Optionally refresh the entire app
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                const errorData = await response.json()
                toast.error(errorData.detail || 'Failed to restore backup')
            }

        } catch (err) {
            console.error('Error restoring backup:', err)
            toast.error('Failed to restore backup. Please try again.')
        } finally {
            setRestoreInProgress(false)
        }
    }

    // Handle backup file selection
    const handleBackupFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (confirm('Are you sure you want to restore this backup? This will replace all current data.')) {
                restoreBackup(file)
            }
        }
        // Reset file input
        event.target.value = ''
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        )
    }

    return error ? (
        <ErrorFallback onRetry={fetchSettings} />
    ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/20">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">System Settings</h1>
                        <p className="text-gray-600 text-lg">Configure your institute settings and manage database</p>
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                <span className="text-red-600 text-sm">{error}</span>
                                <button
                                    onClick={fetchSettings}
                                    className="ml-3 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-lg border border-white/20">
                    <div className="flex space-x-1 p-1">
                        <button
                            onClick={() => setActiveTab('institute')}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${activeTab === 'institute'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Building2 className="w-5 h-5" />
                            <span>Institute Settings</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('database')}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${activeTab === 'database'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Database className="w-5 h-5" />
                            <span>Database Management</span>
                        </button>
                    </div>
                </div>

                {/* Institute Settings Tab */}
                {activeTab === 'institute' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/20">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Building2 className="w-6 h-6 mr-3 text-blue-600" />
                            Institute Information
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Form Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Institute Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={instituteSettings.name}
                                        onChange={(e) => setInstituteSettings(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter institute name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={instituteSettings.address}
                                        onChange={(e) => setInstituteSettings(prev => ({ ...prev, address: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter institute address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={instituteSettings.phone}
                                            onChange={(e) => setInstituteSettings(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={instituteSettings.email}
                                            onChange={(e) => setInstituteSettings(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Email address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={instituteSettings.website}
                                        onChange={(e) => setInstituteSettings(prev => ({ ...prev, website: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                            </div>

                            {/* Right Column - Logo Upload */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Institute Logo
                                    </label>

                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                        {instituteSettings.logoPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={instituteSettings.logoPreview}
                                                    alt="Institute Logo"
                                                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                                                />
                                                <button
                                                    onClick={removeLogo}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                    <Image className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Click to upload logo</p>
                                                    <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleLogoChange}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                            <Camera className="w-4 h-4" />
                                            <span>{instituteSettings.logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={saveInstituteSettings}
                                disabled={saving || !instituteSettings.name.trim()}
                                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Database Management Tab */}
                {activeTab === 'database' && (
                    <div className="space-y-8">
                        {/* Database Statistics */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
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
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
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
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
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
                )}
            </div>
        </div>
    )
}

export default SettingsPage
