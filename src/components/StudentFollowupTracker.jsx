import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, User, BookOpen, Clock, CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentFollowupTracker = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [followupData, setFollowupData] = useState({
    followup_date: '',
    notes: '',
    status: 'PENDING',
    next_followup_date: '',
    handled_by: 'System User'
  });

  // Check API health
  const checkApiHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setApiStatus('connected');
        return true;
      } else {
        setApiStatus('error');
        return false;
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('disconnected');
      return false;
    }
  };

  // Fetch enquiries from backend
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if API is healthy
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        throw new Error('API server is not responding. Please ensure the FastAPI server is running on port 8000.');
      }
      
      const response = await fetch('http://localhost:8000/api/followups/tracker', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
     
      console.log('Response received:', response);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('Server returned HTML instead of JSON. Check if the API endpoint exists and the server is running properly.');
      }
      
      const data = await response.json();
      
      // Handle the response structure
      if (data.enquiries && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
        setFilteredEnquiries(data.enquiries);
        setApiStatus('connected');
      } else {
        console.warn('Unexpected data structure:', data);
        setEnquiries([]);
        setFilteredEnquiries([]);
      }
      
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setError(error.message);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter enquiries based on search and status
  useEffect(() => {
    let filtered = enquiries;

    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.mobileNumber?.includes(searchTerm) ||
        enquiry.id?.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(enquiry => enquiry.currentStatus === statusFilter);
    }

    setFilteredEnquiries(filtered);
  }, [searchTerm, statusFilter, enquiries]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INTERESTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'NOT_INTERESTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'ADMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'INTERESTED': return <CheckCircle className="w-4 h-4" />;
      case 'NOT_INTERESTED': return <XCircle className="w-4 h-4" />;
      case 'ADMITTED': return <BookOpen className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleFollowupClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowFollowupModal(true);
    setFollowupData({
      followup_date: new Date().toISOString().split('T')[0],
      notes: '',
      status: enquiry.currentStatus,
      next_followup_date: '',
      handled_by: 'System User'
    });
  };

  const handleFollowupSubmit = async (e) => {
    e.preventDefault();
    
    if (!followupData.followup_date) {
      alert('Please select a follow-up date');
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        enquiry_id: selectedEnquiry.id,
        followup_date: followupData.followup_date,
        status: followupData.status,
        notes: followupData.notes || '',
        next_followup_date: followupData.next_followup_date || null,
        handled_by: followupData.handled_by
      };

      console.log('Submitting follow-up data:', submitData);

      const response = await fetch('http://localhost:8000/api/followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to save follow-up');
        } else {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`HTTP ${response.status}: Server error`);
        }
      }

      const result = await response.json();
      console.log('Follow-up saved successfully:', result);
      
      // Refresh the enquiries list to get updated data
      await fetchEnquiries();
      
      setShowFollowupModal(false);
      toast.success('Follow-up recorded successfully!');
      
    } catch (error) {
      console.error('Error recording follow-up:', error);
      alert(`Error recording follow-up: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysOverdue = (nextFollowupDate) => {
    if (!nextFollowupDate) return 0;
    const today = new Date();
    const followupDate = new Date(nextFollowupDate);
    const diffTime = today - followupDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading enquiries...</p>
              <p className="text-sm text-gray-500 mt-2">API Status: {apiStatus}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Student Follow-up Tracker
            </h2>
            <p className="text-gray-600">
              Track and manage student enquiry follow-ups
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'connected' ? 'bg-green-500' : 
                apiStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-500">
                API: {apiStatus}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Connection Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <div className="mt-3 space-y-2">
                    <p className="text-red-700 text-sm font-medium">Troubleshooting steps:</p>
                    <ul className="text-red-700 text-sm space-y-1 ml-4">
                      <li>• Ensure FastAPI server is running: <code>uvicorn main:app --reload</code></li>
                      <li>• Check server is running on port 8000</li>
                      <li>• Verify database connection</li>
                      <li>• Check browser console for more details</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={fetchEnquiries}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                    <button
                      onClick={checkApiHealth}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Check API
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, mobile, or enquiry ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                  <option value="ADMITTED">Admitted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {filteredEnquiries.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {enquiries.length === 0 ? 'No enquiries found in database' : 'No enquiries match your search'}
                </p>
                {enquiries.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Make sure your database has enquiry records
                  </p>
                )}
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => {
                const daysOverdue = getDaysOverdue(enquiry.nextFollowup);
                const isOverdue = daysOverdue > 0;
                
                return (
                  <div
                    key={enquiry.id}
                    className={`bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                      isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {enquiry.firstName} {enquiry.middleName} {enquiry.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">ID: {enquiry.id}</p>
                          </div>
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.currentStatus)}`}>
                            {getStatusIcon(enquiry.currentStatus)}
                            {enquiry.currentStatus?.replace('_', ' ')}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{enquiry.mobileNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{enquiry.courseName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Enquiry: {enquiry.enquiryDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                              {enquiry.nextFollowup ? (
                                <>
                                  Next: {enquiry.nextFollowup}
                                  {isOverdue && ` (${daysOverdue} days overdue)`}
                                </>
                              ) : (
                                'No next follow-up scheduled'
                              )}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                          <span>Follow-ups: {enquiry.followupCount || 0}</span>
                          {enquiry.lastFollowup && (
                            <span>Last: {enquiry.lastFollowup}</span>
                          )}
                          {enquiry.latestNotes && (
                            <span className="italic">"{enquiry.latestNotes}"</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <button
                          onClick={() => handleFollowupClick(enquiry)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                        >
                          Add Follow-up
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Follow-up Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Add Follow-up
              </h3>
              <p className="text-gray-600">
                {selectedEnquiry?.firstName} {selectedEnquiry?.lastName} (ID: {selectedEnquiry?.id})
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date *
                </label>
                <input
                  type="date"
                  value={followupData.followup_date}
                  onChange={(e) => setFollowupData({...followupData, followup_date: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={followupData.status}
                  onChange={(e) => setFollowupData({...followupData, status: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="PENDING">Pending</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                  <option value="ADMITTED">Admitted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={followupData.next_followup_date}
                  onChange={(e) => setFollowupData({...followupData, next_followup_date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Handled By *
                </label>
                <input
                  type="text"
                  value={followupData.handled_by}
                  onChange={(e) => setFollowupData({...followupData, handled_by: e.target.value})}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={followupData.notes}
                  onChange={(e) => setFollowupData({...followupData, notes: e.target.value.toUpperCase()})}
                  rows={4}
                  placeholder="Add any notes about the follow-up conversation..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 uppercase"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleFollowupSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Follow-up'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFollowupModal(false)}
                  disabled={submitting}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFollowupTracker;
