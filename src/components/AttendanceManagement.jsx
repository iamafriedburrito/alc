import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Users, Filter, Save, Calendar, Clock } from 'lucide-react';

const AttendanceManagement = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(`${API_BASE}/admissions`);
        if (response.ok) {
          const data = await response.json();
          const batchSet = new Set((data.admissions || []).map(s => s.timing));
          setBatches([...batchSet].filter(Boolean));
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
        toast.error('Failed to fetch batches');
      }
    };
    fetchBatches();
  }, [API_BASE]);

  // Fetch students for selected batch
  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/admissions`);
        if (response.ok) {
          const data = await response.json();
          // Filter students by timing/batch
          const filteredStudents = (data.admissions || []).filter(s => s.timing === selectedBatch);
          setStudents(filteredStudents);
          // Default: everyone present
          const att = {};
          filteredStudents.forEach(s => att[s.id] = 'PRESENT');
          setAttendance(att);
        } else {
          toast.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedBatch, API_BASE]);

  // Mark all present
  const markAllPresent = () => {
    const att = {};
    students.forEach(s => att[s.id] = 'PRESENT');
    setAttendance(att);
    toast.success('All students marked as present');
  };

  // Mark all absent
  const markAllAbsent = () => {
    const att = {};
    students.forEach(s => att[s.id] = 'ABSENT');
    setAttendance(att);
    toast.success('All students marked as absent');
  };

  // Toggle present/absent
  const toggleAttendance = (student_id) => {
    setAttendance(prev => ({
      ...prev,
      [student_id]: prev[student_id] === 'ABSENT' ? 'PRESENT' : 'ABSENT'
    }));
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (!selectedBatch || students.length === 0) {
      toast.error('Please select a batch and ensure students are loaded');
      return;
    }

    setSaving(true);
    try {
      const records = students.map(s => ({
        student_id: s.id,
        date,
        batch_timing: selectedBatch,
        status: attendance[s.id] || 'PRESENT'
      }));

      const response = await fetch(`${API_BASE}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records)
      });

      if (response.ok) {
        toast.success('Attendance saved successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" /> Attendance Management
            </h2>
            <div className="flex gap-3 items-center">
              <label className="font-medium text-gray-700 flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                Batch:
              </label>
              <select
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Batch</option>
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
              <label className="font-medium text-gray-700 flex items-center gap-2 ml-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {selectedBatch && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={markAllPresent}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Mark All Absent
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {students.map(student => (
                  <div
                    key={student.id}
                    className={`bg-gray-50 rounded-2xl shadow-sm p-4 flex flex-col items-center border-2 transition-all duration-200 h-full ${
                      attendance[student.id] === 'ABSENT' 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-green-200 bg-green-50'
                    }`}
                    style={{ minHeight: '320px' }}
                  >
                    <img
                      src={`${API_BASE.replace('/api', '')}/uploads/${student.photoFilename}`}
                      alt={student.firstName + ' ' + student.lastName}
                      className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96x96?text=No+Photo';
                      }}
                    />
                    <div className="text-lg font-semibold text-gray-900 text-center mb-1 min-h-[3.5rem] flex items-center justify-center">
                      {student.firstName} {student.middleName || ''} {student.lastName}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 text-center flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {student.timing}
                    </p>
                    <div className="mt-auto w-full flex justify-center">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 w-full max-w-[140px] justify-center ${
                          attendance[student.id] === 'ABSENT' 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {attendance[student.id] === 'ABSENT' ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        {attendance[student.id] === 'ABSENT' ? 'Absent' : 'Present'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </>
          ) : selectedBatch ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">No students found for the selected batch.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Batch</h3>
              <p className="text-gray-600">Please select a batch to view and mark attendance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement; 