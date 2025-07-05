import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Search, Plus, Edit2, Trash2, Save, X, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from 'react-toastify';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [stats, setStats] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);

  // API base URL
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
      // If not searching, update totalCourses
      if (!search) {
        setTotalCourses((data.courses && data.courses.length) || 0);
      }
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
      toast.success(result.message || (editingCourse ? 'Course updated successfully!' : 'Course created successfully!'));
      
      // Refresh courses list and stats
      fetchCourses(searchTerm);
      fetchStats();
      closeModal();
      
    } catch (error) {
      console.error('Error saving course:', error);
      setApiError(error.message || 'Error saving course. Please try again.');
    }
  };

  const confirmDeleteCourse = (course) => {
    setCourseToDelete(course);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    setApiError('');
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete course');
      }
      const result = await response.json();
      toast.success(result.message || 'Course deleted successfully!');
      fetchCourses(searchTerm);
      fetchStats();
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      setApiError(error.message || 'Error deleting course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchCourses(), fetchStats()]);
    toast.success('Courses refreshed!');
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
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs ${
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
      <div className="max-w-5xl mx-auto">
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
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-xl p-8 border border-white/20 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 md:mb-4 text-left md:text-left">
                Course Management
              </h2>
              <div className="inline-flex items-center gap-3 bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-2 shadow-sm text-base font-medium text-blue-900">
                <span className="text-blue-500">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span>
                  <span className="font-semibold">Total:</span> {totalCourses}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
              >
                <Plus className="w-5 h-5" />
                Add Course
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 transition-all duration-200 ease-in-out"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Courses
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 z-10" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-xs text-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20 text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20 text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first course'}
            </p>
          </div>
        ) : !isLoading && (
          <div className="overflow-x-auto">
            <div className="bg-white/80 rounded-2xl shadow border border-blue-100">
              <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr className="bg-blue-200 text-gray-700 text-sm">
                    <th className="px-4 py-3 text-left rounded-tl-2xl">#</th>
                    <th className="px-4 py-3 text-left">Course Name</th>
                    <th className="px-4 py-3 text-left">Fees (₹)</th>
                    <th className="px-4 py-3 text-left">Added Date</th>
                    <th className="px-4 py-3 text-center rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => {
                    const isLast = index === courses.length - 1;
                    return (
                      <tr key={course.id} className="bg-white">
                        <td className={`px-4 py-3 font-medium text-blue-600${isLast ? ' rounded-bl-2xl' : ''}`}>{index + 1}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 truncate max-w-xs">{course.courseName}</td>
                        <td className="px-4 py-3 text-green-700 font-semibold">₹{course.fees?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '-'}</td>
                        <td className={`px-4 py-3 text-center${isLast ? ' rounded-br-2xl' : ''}`}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openModal(course)}
                              className="py-1.5 px-3 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 flex items-center gap-1 transition text-sm"
                              title="Edit course"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => confirmDeleteCourse(course)}
                              className="py-1.5 px-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 flex items-center gap-1 transition text-sm"
                              title="Delete course"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
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
                  <div className="flex justify-end space-x-3 pt-4">
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

        {courseToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Delete Course</h2>
                  <button
                    onClick={() => setCourseToDelete(null)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-6 text-gray-700 text-lg">
                  Are you sure you want to delete <span className="font-semibold text-red-600">“{courseToDelete.courseName}”</span>?
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCourseToDelete(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCourse}
                    disabled={isDeleting}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-6 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;
