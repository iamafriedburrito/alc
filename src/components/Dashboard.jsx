import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, Phone, FileText, UserPlus } from "lucide-react"

const Dashboard = () => {
    // Mock data - replace with real data from your API
    const stats = {
        totalEnquiries: 156,
        totalAdmissions: 89,
        activeCourses: 12,
        pendingFollowups: 23,
    }

    const recentActivities = [
        { id: 1, type: "enquiry", message: "New enquiry from John Doe for MS-CIT course", time: "2 hours ago" },
        { id: 2, type: "admission", message: "Jane Smith completed admission process", time: "4 hours ago" },
        { id: 3, type: "followup", message: "Follow-up scheduled for 5 students", time: "6 hours ago" },
        { id: 4, type: "course", message: 'New course "Advanced Excel" added', time: "1 day ago" },
    ]

    const quickActions = [
        { label: "Add Enquiry", icon: UserPlus, path: "/enquiry", color: "bg-blue-500" },
        { label: "New Admission", icon: GraduationCap, path: "/admission", color: "bg-green-500" },
        { label: "Generate Receipt", icon: FileText, path: "/receipt", color: "bg-purple-500" },
        { label: "Follow-up Tracker", icon: Phone, path: "/followup", color: "bg-orange-500" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to EduManage Dashboard</h1>
                    <p className="text-gray-600 text-lg">Manage your institute efficiently with our comprehensive system</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
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

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
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

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
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

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
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
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
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
                                    className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
                                >
                                    <Icon className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">{action.label}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        Recent Activities
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">System Status</h3>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Database Connected</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">API Online</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
