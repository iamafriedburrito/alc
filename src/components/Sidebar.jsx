import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Users, 
  UserPlus, 
  FileText, 
  GraduationCap, 
  BookOpen, 
  UserCheck,
  Phone,
  Settings
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'enquiry', label: 'Student Enquiry', icon: UserPlus, path: '/enquiry' },
    { id: 'admission', label: 'Student Admission', icon: GraduationCap, path: '/admission' },
    { id: 'enquiry-list', label: 'Enquiries List', icon: Users, path: '/enquiry-list' },
    { id: 'admission-list', label: 'Admissions List', icon: UserCheck, path: '/admission-list' },
    { id: 'fee-receipt', label: 'Fee Receipt', icon: FileText, path: '/fee-receipt' },
    { id: 'courses-fees', label: 'Courses & Fees', icon: BookOpen, path: '/courses-fees' },
    { id: 'followup-tracker', label: 'Follow-up Tracker', icon: Phone, path: '/followup-tracker' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    // You can add navigation logic here
    console.log(`Navigating to ${item.path}`);
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} transition-all duration-500 ease-in-out bg-white/90 backdrop-blur-sm border-r border-gray-200/50 shadow-xl flex flex-col h-screen relative`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 flex-shrink-0">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-500 ease-in-out overflow-hidden ${
              isCollapsed 
                ? 'opacity-0 transform translate-x-4 pointer-events-none w-0' 
                : 'opacity-100 transform translate-x-0'
            }`}>
              <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">EduManage</h1>
              <p className="text-sm text-gray-500 whitespace-nowrap">Institute Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:transform hover:scale-[1.01]'
              } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out ${
                isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
              }`} />
              
              <span className={`font-medium text-sm whitespace-nowrap transition-all duration-500 ease-in-out ${
                isCollapsed 
                  ? 'opacity-0 transform translate-x-4 pointer-events-none w-0' 
                  : 'opacity-100 transform translate-x-0 w-auto'
              }`}>
                {item.label}
              </span>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out whitespace-nowrap z-50 flex items-center transform translate-x-2 group-hover:translate-x-0">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 flex-shrink-0">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group relative transition-all duration-300 ease-in-out">
              <span className="text-white font-semibold text-sm">AD</span>
              
              {/* Tooltip for collapsed state */}
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out whitespace-nowrap z-50 flex items-center transform translate-x-2 group-hover:translate-x-0">
                Admin User
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
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
        className="absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-180 z-10 group"
      >
        <div className="transition-transform duration-300 ease-in-out">
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-gray-600 transition-all duration-300 ease-in-out" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-gray-600 transition-all duration-300 ease-in-out" />
          )}
        </div>
      </button>
    </div>
  );
};

// Demo component to show how to use the sidebar
const SidebarDemo = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      {/* Main content area */}
      <div className={`flex-1 p-8 overflow-auto transition-all duration-500 ease-in-out ${
        isCollapsed ? 'ml-0' : 'ml-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Main Content Area</h2>
              <p className="text-gray-600">
                This is where your main content would go. The sidebar transitions smoothly between collapsed and expanded states.
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100/50 px-3 py-2 rounded-lg">
              Sidebar: {isCollapsed ? 'Collapsed' : 'Expanded'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <div 
                key={item} 
                className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ease-in-out hover:transform hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Card {item}</h3>
                <p className="text-gray-600 text-sm">Sample content card to demonstrate the layout with the animated sidebar.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarDemo;
