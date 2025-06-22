import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Search, Plus, Edit2, Trash2, Save, X, BookOpen, AlertCircle } from "lucide-react";

const CoursesFeesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [stats, setStats] = useState(null);

  // Configure your API base URL - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:8000/api';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      courseName: "",
      fees: "",
    },
  });

  // Fetch courses from API
  const fetchCourses = async (search = '') => {
    setIsLoading(true);
    setApiError('');
    try {
      const url = search 
        ? `${API_BASE_URL}/courses?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/courses`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setApiError('Failed to fetch courses. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/stats/overview`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  // Search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchCourses(searchTerm);
      } else {
        fetchCourses();
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const openModal = (course = null) => {
    setEditingCourse(course);
    setApiError('');
    if (course) {
      setValue('courseName', course.courseName);
      setValue('fees', course.fees);
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setApiError('');
    reset();
  };

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const courseData = {
        courseName: data.courseName.trim(),
        fees: parseInt(data.fees)
      };

      let response;
      if (editingCourse) {
        // Update existing course
        response = await fetch(`${API_BASE_URL}/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
      } else {
        // Create new course
        response = await fetch(`${API_BASE_URL}/courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save course');
      }

      const result = await response.json();
      
      // Show success message
      alert(result.message || (editingCourse ? 'Course updated successfully!' : 'Course created successfully!'));
      
      // Refresh courses list and stats
      fetchCourses(searchTerm);
      fetchStats();
      closeModal();
      
    } catch (error) {
      console.error('Error saving course:', error);
      setApiError(error.message || 'Error saving course. Please try again.');
    }
  };

  const deleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.courseName}"?`)) {
      setIsLoading(true);
      setApiError('');
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${course.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to delete course');
        }

        const result = await response.json();
        alert(result.message || 'Course deleted successfully!');
        
        // Refresh courses list and stats
        fetchCourses(searchTerm);
        fetchStats();
        
      } catch (error) {
        console.error('Error deleting course:', error);
        setApiError(error.message || 'Error deleting course. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const FormInput = ({ name, label, type = "text", placeholder, required = false, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...(name === 'courseName' && {
            minLength: { value: 1, message: "Course name cannot be empty" },
            maxLength: { value: 255, message: "Course name is too long" }
          }),
          ...(type === "number" && { 
            min: { value: 1, message: "Fees must be greater than 0" },
            pattern: { value: /^\d+$/, message: "Please enter a valid amount" }
          }),
        })}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm ${
          errors[name]
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        }`}
        {...props}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* API Error Banner */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{apiError}</span>
              <button
                onClick={() => setApiError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Courses & Fees
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm space-y-1 sm:space-y-0 sm:space-x-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {courses.length} courses available
                </span>
                {stats && (
                  <>
                    <span>Avg fees: ₹{stats.average_fees?.toLocaleString()}</span>
                    <span>Range: ₹{stats.min_fees?.toLocaleString()} - ₹{stats.max_fees?.toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 w-64 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-sm"
                />
              </div>
              
              {/* Add Course Button */}
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Course
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first course'}
            </p>
          </div>
        ) : !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {courses.map((course, index) => (
              <div key={course.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-4 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{course.courseName}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-lg font-bold text-green-600">₹{course.fees?.toLocaleString()}</span>
                        </div>
                        {course.createdAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Added: {new Date(course.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openModal(course)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                      title="Edit course"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCourse(course)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* API Error in Modal */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {apiError}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <FormInput
                    name="courseName"
                    label="Course Name"
                    placeholder="Enter course name"
                    required
                  />
                  <FormInput
                    name="fees"
                    label="Fees (₹)"
                    type="number"
                    placeholder="Enter course fees"
                    required
                    min="1"
                  />

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          {editingCourse ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesFeesManagement;
