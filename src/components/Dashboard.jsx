import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Users, GraduationCap, BookOpen, TrendingUp, Phone, FileText, UserPlus, AlertCircle, CheckCircle, User, Lightbulb } from "lucide-react"
import ErrorFallback from './ErrorFallback'

const Dashboard = () => {
    const navigate = useNavigate()
    
    const [stats, setStats] = useState({
        totalEnquiries: 0,
        totalAdmissions: 0,
        activeCourses: 0,
        pendingFollowups: 0,
    })

    const [recentEnquiries, setRecentEnquiries] = useState([])
    const [recentAdmissions, setRecentAdmissions] = useState([])
    const [followupStats, setFollowupStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // API base URL from environment
    const API_BASE = import.meta.env.VITE_API_URL

    // Navigation handler
    const handleNavigation = (path) => {
        navigate(path)
        console.log(`Navigating to: ${path}`)
    }

    const fetchData = async () => {
        setError(null)
        try {
            setLoading(true)

            // Fetch all data in parallel
            const [
                statsResponse,
                enquiriesResponse,
                admissionsResponse,
                followupStatsResponse,
                coursesResponse
            ] = await Promise.all([
                fetch(`${API_BASE}/stats`).catch(() => ({ ok: false })),
                fetch(`${API_BASE}/enquiries`).catch(() => ({ ok: false })),
                fetch(`${API_BASE}/admissions`).catch(() => ({ ok: false })),
                fetch(`${API_BASE}/followups/stats`).catch(() => ({ ok: false })),
                fetch(`${API_BASE}/courses`).catch(() => ({ ok: false }))
            ])

            // If any response is not OK, show error fallback
            if (
                !statsResponse.ok ||
                !enquiriesResponse.ok ||
                !admissionsResponse.ok ||
                !followupStatsResponse.ok ||
                !coursesResponse.ok
            ) {
                setError('Failed to load dashboard data. Please check your connection.');
                setLoading(false);
                return;
            }

            // Process stats
            const statsData = await statsResponse.json()
            setStats(prevStats => ({
                ...prevStats,
                totalEnquiries: statsData.total_enquiries || 0,
                totalAdmissions: statsData.total_admissions || 0,
            }))

            // Process enquiries
            const enquiriesData = await enquiriesResponse.json()
            const sortedEnquiries = enquiriesData.enquiries
                ?.sort((a, b) => new Date(b.enquiryDate) - new Date(a.enquiryDate))
                ?.slice(0, 5) || []
            setRecentEnquiries(sortedEnquiries)
            
            // Update enquiries count if not from stats API
            if (!statsResponse.ok) {
                setStats(prev => ({ ...prev, totalEnquiries: enquiriesData.total || 0 }))
            }

            // Process admissions
            const admissionsData = await admissionsResponse.json()
            const sortedAdmissions = admissionsData.admissions
                ?.sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
                ?.slice(0, 5) || []
            setRecentAdmissions(sortedAdmissions)
            
            // Update admissions count if not from stats API
            if (!statsResponse.ok) {
                setStats(prev => ({ ...prev, totalAdmissions: admissionsData.total || 0 }))
            }

            // Process followup stats
            const followupData = await followupStatsResponse.json()
            setFollowupStats(followupData)
            setStats(prev => ({ 
                ...prev, 
                pendingFollowups: followupData.pending_followups || 0 
            }))

            // Process courses
            const coursesData = await coursesResponse.json()
            setStats(prev => ({ 
                ...prev, 
                activeCourses: coursesData.total || 0 
            }))

        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError('Failed to load dashboard data. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // Refresh data every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const quickActions = [
        { label: "Add Enquiry", icon: UserPlus, path: "/enquiry", color: "bg-blue-500" },
        { label: "New Admission", icon: GraduationCap, path: "/admission", color: "bg-green-500" },
    ]

    // Tips array for randomization
    const tips = [
        {
            title: "💡 Productivity Tip",
            content: "Use the quick actions to add new enquiries and admissions faster. Regular follow-ups increase conversion rates by 40%.",
            bgClass: "bg-gradient-to-r from-blue-50 to-indigo-50",
            borderClass: "border-blue-400",
            textClass: "text-blue-800",
            titleClass: "text-blue-900"
        },
        {
            title: "📊 Daily Insight",
            content: "Track your enquiry-to-admission ratio to optimize your marketing strategies and improve student recruitment.",
            bgClass: "bg-gradient-to-r from-green-50 to-emerald-50",
            borderClass: "border-green-400",
            textClass: "text-green-800",
            titleClass: "text-green-900"
        },
        {
            title: "🎯 Best Practice",
            content: "Update student information regularly and maintain detailed follow-up records to improve conversion rates.",
            bgClass: "bg-gradient-to-r from-purple-50 to-violet-50",
            borderClass: "border-purple-400",
            textClass: "text-purple-800",
            titleClass: "text-purple-900"
        },
        {
            title: "📈 Growth Tip",
            content: "Analyze peak enquiry periods and optimize your course offerings accordingly for better results.",
            bgClass: "bg-gradient-to-r from-orange-50 to-amber-50",
            borderClass: "border-orange-400",
            textClass: "text-orange-800",
            titleClass: "text-orange-900"
        }
    ]

    // Get a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)]

    // Limit to 2 for dashboard display
    const displayedEnquiries = recentEnquiries.slice(0, 2)
    const displayedAdmissions = recentAdmissions.slice(0, 2)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        )
    }

    return error ? (
        <ErrorFallback onRetry={fetchData} />
    ) : (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xs rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to EduManage Dashboard</h1>
                    <p className="text-gray-600 text-lg">Manage your institute efficiently with our comprehensive system</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                     onClick={() => handleNavigation('/enquiries')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalEnquiries}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                     onClick={() => handleNavigation('/admissions')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Admissions</p>
                            <p className="text-3xl font-bold text-green-600">{stats.totalAdmissions}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                     onClick={() => handleNavigation('/courses')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Courses</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.activeCourses}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                     onClick={() => handleNavigation('/followup')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Follow-ups</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.pendingFollowups}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <button
                                    key={index}
                                    className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
                                    onClick={() => handleNavigation(action.path)}
                                    title={`Navigate to ${action.label}`}
                                >
                                    <Icon className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">{action.label}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                        Daily Tip
                    </h3>
                    <div className={`${randomTip.bgClass} p-4 rounded-lg border-l-4 ${randomTip.borderClass}`}>
                        <h4 className={`font-medium mb-2 ${randomTip.titleClass}`}>{randomTip.title}</h4>
                        <p className={`text-sm ${randomTip.textClass}`}>
                            {randomTip.content}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Enquiries and Admissions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Enquiries */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-600" />
                            Recent Enquiries
                        </h3>
                        <button 
                            onClick={() => handleNavigation('/enquiries')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {displayedEnquiries.length > 0 ? (
                            displayedEnquiries.map((enquiry) => (
                                <div key={enquiry.id || enquiry.enquiryId} className="flex items-start space-x-3 p-4 min-h-[72px] bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                     onClick={() => handleNavigation(`/enquiry/${enquiry.id || enquiry.enquiryId}`)}>
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {enquiry.firstName} {enquiry.lastName}
                                        </p>
                                        <p className="text-xs text-gray-600 mb-1">
                                            Course: {enquiry.courseName || 'Not specified'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Mobile: {enquiry.mobileNumber}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No recent enquiries found</p>
                                <button 
                                    onClick={() => handleNavigation('/enquiry')}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Add First Enquiry
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Admissions */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                            Recent Admissions
                        </h3>
                        <button 
                            onClick={() => handleNavigation('/admissions')}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {displayedAdmissions.length > 0 ? (
                            displayedAdmissions.map((admission) => (
                                <div key={admission.id || admission.admissionId} className="flex items-start space-x-3 p-4 min-h-[72px] bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                     onClick={() => handleNavigation(`/admission/${admission.id || admission.admissionId}`)}>
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {admission.firstName} {admission.lastName}
                                        </p>
                                        <p className="text-xs text-gray-600 mb-1">
                                            Course: {admission.courseName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Mobile: {admission.mobileNumber}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No recent admissions found</p>
                                <button 
                                    onClick={() => handleNavigation('/admission')}
                                    className="mt-2 text-sm text-green-600 hover:text-green-800"
                                >
                                    Add First Admission
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Follow-up Summary */}
            {followupStats && Object.keys(followupStats).length > 0 && (
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-orange-600" />
                        Follow-up Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {followupStats.pending_followups && (
                            <div className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                                 onClick={() => handleNavigation('/followup?filter=pending')}>
                                <p className="text-2xl font-bold text-orange-600">{followupStats.pending_followups}</p>
                                <p className="text-sm text-gray-600">Pending</p>
                            </div>
                        )}
                        {followupStats.completed_followups && (
                            <div className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                                 onClick={() => handleNavigation('/followup?filter=completed')}>
                                <p className="text-2xl font-bold text-green-600">{followupStats.completed_followups}</p>
                                <p className="text-sm text-gray-600">Completed</p>
                            </div>
                        )}
                        {followupStats.overdue_followups && (
                            <div className="text-center p-4 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                                 onClick={() => handleNavigation('/followup?filter=overdue')}>
                                <p className="text-2xl font-bold text-red-600">{followupStats.overdue_followups}</p>
                                <p className="text-sm text-gray-600">Overdue</p>
                            </div>
                        )}
                        {followupStats.total_followups && (
                            <div className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                                 onClick={() => handleNavigation('/followup')}>
                                <p className="text-2xl font-bold text-blue-600">{followupStats.total_followups}</p>
                                <p className="text-sm text-gray-600">Total</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
