import { Link } from 'react-router'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="relative">
                        {/* Main circle */}
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                            <span className="text-white text-6xl font-bold">404</span>
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-8 -right-6 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Page Not Found
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Oops! The page you're looking for doesn't exist.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-4">
                            Don't worry, you can navigate back to safety:
                        </p>
                        
                        <div className="space-y-3">
                            <Link
                                to="/"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md block"
                            >
                                🏠 Go to Dashboard
                            </Link>
                            
                            <Link
                                to="/enquiries"
                                className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-medium border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 block"
                            >
                                📋 View Enquiries
                            </Link>
                            
                            <Link
                                to="/admissions"
                                className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-medium border-2 border-gray-200 hover:border-green-300 hover:text-green-600 transition-all duration-200 block"
                            >
                                👥 Manage Students
                            </Link>
                        </div>
                    </div>

                    {/* Helpful tip */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-center space-x-2 text-blue-700">
                            <span className="text-lg">💡</span>
                            <span className="text-sm font-medium">
                                Tip: Check the URL or use the navigation menu above
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound 