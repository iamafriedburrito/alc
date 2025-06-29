import { Link, useLocation } from "react-router"
import { Home, Users, UserPlus, FileText, GraduationCap, BookOpen, UserCheck, Phone } from "lucide-react"

const Sidebar = () => {
    const location = useLocation()

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
        { id: "enquiry", label: "Student Enquiry", icon: UserPlus, path: "/enquiry" },
        { id: "admission", label: "Student Admission", icon: GraduationCap, path: "/admission" },
        { id: "enquiries", label: "Enquiries List", icon: Users, path: "/enquiries" },
        { id: "admissions", label: "Admissions List", icon: UserCheck, path: "/admissions" },
        { id: "receipt", label: "Fee Receipt", icon: FileText, path: "/receipt" },
        { id: "courses", label: "Courses & Fees", icon: BookOpen, path: "/courses" },
        { id: "followup", label: "Follow-up Tracker", icon: Phone, path: "/followup" },
    ]

    return (
        <div className="w-80 transition-all duration-500 ease-in-out bg-white/90 backdrop-blur-sm border-r border-gray-200/50 shadow-xl flex flex-col h-screen relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 flex-shrink-0">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3 w-full">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0 transition-all duration-500 ease-in-out overflow-hidden">
                            <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">EduManage</h1>
                            <p className="text-sm text-gray-500 whitespace-nowrap">Institute Management</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden space-x-3 ${isActive
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]"
                                : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:transform hover:scale-[1.01]"
                                }`}
                        >
                            <Icon
                                className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                                    }`}
                            />

                            <span className="font-medium text-sm whitespace-nowrap transition-all duration-500 ease-in-out">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 flex-shrink-0">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 transition-all duration-500 ease-in-out">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">AD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@institute.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
