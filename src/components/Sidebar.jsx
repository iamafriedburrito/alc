import { useState } from "react"
import { Link, useLocation } from "react-router"
import { Tooltip } from "react-tooltip"
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Users,
    UserPlus,
    GraduationCap,
    BookOpen,
    UserCheck,
    Phone,
    Settings,
    DollarSign,
} from "lucide-react"

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
        { id: "enquiry", label: "New Enquiry", icon: UserPlus, path: "/enquiry" },
        { id: "admission", label: "Student Admission", icon: GraduationCap, path: "/admission" },
        { id: "enquiries", label: "Enquiries List", icon: Users, path: "/enquiries" },
        { id: "admissions", label: "Admissions List", icon: UserCheck, path: "/admissions" },
        { id: "courses", label: "Courses & Fees", icon: BookOpen, path: "/courses" },
        { id: "fees", label: "Fee Management", icon: DollarSign, path: "/fees" },
        { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    ]

    return (
        <div
            className={`${isCollapsed ? "w-20" : "w-80"} transition-all duration-500 ease-in-out bg-white/90 backdrop-blur-sm border-r border-gray-200/50 shadow-xl flex flex-col h-screen relative`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 flex-shrink-0">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3 w-full">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div
                            className={`flex-1 min-w-0 transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed
                                    ? "opacity-0 transform translate-x-4 pointer-events-none w-0"
                                    : "opacity-100 transform translate-x-0"
                                }`}
                        >
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
                        <div key={item.id}>
                            <Tooltip id="sidebar-tip" place="right" />
                            <Link
                                to={item.path}
                                data-tooltip-id="sidebar-tip"
                                data-tooltip-content={item.label}
                                data-tooltip-hidden={!isCollapsed}
                                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${isActive
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]"
                                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:transform hover:scale-[1.01]"
                                    } ${isCollapsed ? "justify-center" : "space-x-3"}`}
                            >
                                <Icon
                                    className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                                        }`}
                                />

                                <span
                                    className={`font-medium text-sm whitespace-nowrap transition-all duration-500 ease-in-out ${isCollapsed
                                            ? "opacity-0 transform translate-x-4 pointer-events-none w-0"
                                            : "opacity-100 transform translate-x-0 w-auto"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        </div>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 flex-shrink-0">
                {isCollapsed ? (
                    <div className="flex justify-center">
                        {/* Tooltip for collapsed state */}
                        <Tooltip id="admin-tooltip" />
                        <div
                            data-tooltip-id="admin-tooltip"
                            data-tooltip-content="Admin User"
                            className="z-2000 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group relative transition-all duration-300 ease-in-out"
                        >
                            <span className="text-white font-semibold text-sm">AD</span>
                        </div>
                    </div>
                ) : (
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
                )}
            </div>

            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-20 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 z-10 group"
            >
                <div className="transition-transform duration-300 ease-in-out">
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 text-gray-600 transition-all duration-300 ease-in-out" />
                    ) : (
                        <ChevronLeft className="h-5 w-5 text-gray-600 transition-all duration-300 ease-in-out" />
                    )}
                </div>
            </button>
        </div>
    )
}

export default Sidebar;
