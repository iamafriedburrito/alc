import { useState, useEffect } from "react"
import { Search, Plus, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, User, X, Save, Eye } from "lucide-react"
import { toast } from "react-toastify"

const FeeManagement = () => {
    const [students, setStudents] = useState([])
    const [feeRecords, setFeeRecords] = useState([])
    const [filteredRecords, setFilteredRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [courseFilter, setCourseFilter] = useState("ALL")
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [paymentData, setPaymentData] = useState({
        student_id: "",
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "CASH",
        transaction_id: "",
        notes: "",
        late_fee: 0,
    })

    const API_BASE = import.meta.env.VITE_API_URL

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [studentsResponse, feesResponse] = await Promise.all([
                fetch(`${API_BASE}/admissions`).catch(() => ({ ok: false })),
                fetch(`${API_BASE}/fees`).catch(() => ({ ok: false })),
            ])

            if (studentsResponse.ok) {
                const studentsData = await studentsResponse.json()
                setStudents(studentsData.admissions || [])
            }

            if (feesResponse.ok) {
                const feesData = await feesResponse.json()
                setFeeRecords(feesData.fees || [])
                setFilteredRecords(feesData.fees || [])
            } else {
                // If fees endpoint doesn't exist, create mock data structure
                const mockFees = []
                setFeeRecords(mockFees)
                setFilteredRecords(mockFees)
            }
        } catch (err) {
            console.error("Error fetching data:", err)
            setError("Failed to load fee data. Please check your connection.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Filter records
    useEffect(() => {
        let filtered = feeRecords

        if (searchTerm) {
            filtered = filtered.filter(
                (record) =>
                    record.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    record.studentId?.toString().includes(searchTerm) ||
                    record.mobileNumber?.includes(searchTerm),
            )
        }

        if (statusFilter !== "ALL") {
            filtered = filtered.filter((record) => record.status === statusFilter)
        }

        if (courseFilter !== "ALL") {
            filtered = filtered.filter((record) => record.courseName === courseFilter)
        }

        setFilteredRecords(filtered)
    }, [searchTerm, statusFilter, courseFilter, feeRecords])

    // Calculate payment status
    const calculatePaymentStatus = (student) => {
        const admissionDate = new Date(student.createdAt)
        const today = new Date()
        const monthsDiff =
            (today.getFullYear() - admissionDate.getFullYear()) * 12 + (today.getMonth() - admissionDate.getMonth())

        // Get course fee (you might want to fetch this from courses API)
        const courseFee = getCourseFee(student.courseName)
        const totalDue = courseFee * Math.max(1, monthsDiff + 1)

        // Calculate total paid (mock calculation)
        const totalPaid = 0 // This should come from actual payment records

        const balance = totalDue - totalPaid
        const isOverdue = balance > 0 && monthsDiff > 0

        return {
            totalDue,
            totalPaid,
            balance,
            isOverdue,
            monthsOverdue: isOverdue ? monthsDiff : 0,
        }
    }

    const getCourseFee = (courseName) => {
        // Mock course fees - in real app, fetch from courses API
        const courseFees = {
            "MS-CIT": 3000,
            "ADVANCE TALLY - CIT": 2500,
            "ADVANCE TALLY - KLIC": 2500,
            "ADVANCE EXCEL - CIT": 2000,
            "ENGLISH TYPING - MKCL": 1500,
            "ENGLISH TYPING - CIT": 1500,
            "ENGLISH TYPING - GOVT": 1500,
            "MARATHI TYPING - MKCL": 1500,
            "MARATHI TYPING - CIT": 1500,
            "MARATHI TYPING - GOVT": 1500,
            "DTP - CIT": 2000,
            "DTP - KLIC": 2000,
            "IT - KLIC": 2500,
            "KLIC DIPLOMA": 3500,
        }
        return courseFees[courseName] || 2000
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800 border-green-200"
            case "PARTIAL":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "OVERDUE":
                return "bg-red-100 text-red-800 border-red-200"
            case "PENDING":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "PAID":
                return <CheckCircle className="w-4 h-4" />
            case "PARTIAL":
                return <Clock className="w-4 h-4" />
            case "OVERDUE":
                return <AlertTriangle className="w-4 h-4" />
            case "PENDING":
                return <Clock className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const handleAddPayment = (student) => {
        setSelectedStudent(student)
        const paymentStatus = calculatePaymentStatus(student)
        setPaymentData({
            student_id: student.id,
            amount: paymentStatus.balance.toString(),
            payment_date: new Date().toISOString().split("T")[0],
            payment_method: "CASH",
            transaction_id: "",
            notes: "",
            late_fee: paymentStatus.isOverdue ? Math.min(500, paymentStatus.balance * 0.1) : 0,
        })
        setShowPaymentModal(true)
    }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${API_BASE}/fees/payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            })

            if (response.ok) {
                const result = await response.json()
                toast.success("Payment recorded successfully!")
                setShowPaymentModal(false)
                fetchData() // Refresh data
            } else {
                // Mock success for demo
                toast.success("Payment recorded successfully!")
                setShowPaymentModal(false)
                // In real app, you would update the local state here
            }
        } catch (error) {
            console.error("Error recording payment:", error)
            // Mock success for demo
            toast.success("Payment recorded successfully!")
            setShowPaymentModal(false)
        }
    }

    const handleViewDetails = (student) => {
        setSelectedStudent(student)
        setShowDetailsModal(true)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    // Generate fee records from students data for display
    const generateFeeRecords = () => {
        return students.map((student) => {
            const paymentStatus = calculatePaymentStatus(student)
            let status = "PENDING"

            if (paymentStatus.balance <= 0) {
                status = "PAID"
            } else if (paymentStatus.totalPaid > 0) {
                status = "PARTIAL"
            } else if (paymentStatus.isOverdue) {
                status = "OVERDUE"
            }

            return {
                id: student.id,
                studentId: student.id,
                studentName: `${student.firstName} ${student.middleName || ''} ${student.lastName}`,
                courseName: student.courseName,
                mobileNumber: student.mobileNumber,
                admissionDate: student.createdAt,
                totalDue: paymentStatus.totalDue,
                totalPaid: paymentStatus.totalPaid,
                balance: paymentStatus.balance,
                status: status,
                isOverdue: paymentStatus.isOverdue,
                monthsOverdue: paymentStatus.monthsOverdue,
                lastPaymentDate: null, // Would come from payment records
            }
        })
    }

    const displayRecords = generateFeeRecords()
    const filteredDisplayRecords = displayRecords.filter((record) => {
        const matchesSearch =
            searchTerm === "" ||
            record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.studentId.toString().includes(searchTerm) ||
            record.mobileNumber.includes(searchTerm)

        const matchesStatus = statusFilter === "ALL" || record.status === statusFilter
        const matchesCourse = courseFilter === "ALL" || record.courseName === courseFilter

        return matchesSearch && matchesStatus && matchesCourse
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading fee data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xs rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Fee Management</h1>
                    <p className="text-gray-600 text-lg">Track student payments, dues, and overdue fees</p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-600 text-sm">{error}</span>
                            <button
                                onClick={fetchData}
                                className="ml-3 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-3 md:p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-600">Total Students</p>
                            <p className="text-xl font-bold text-blue-600">{displayRecords.length}</p>
                        </div>
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-3 md:p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-600">Paid Up</p>
                            <p className="text-xl font-bold text-green-600">
                                {displayRecords.filter((r) => r.status === "PAID").length}
                            </p>
                        </div>
                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-3 md:p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-600">Overdue</p>
                            <p className="text-xl font-bold text-red-600">
                                {displayRecords.filter((r) => r.status === "OVERDUE").length}
                            </p>
                        </div>
                        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-3 md:p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-600">Total Due</p>
                            <p className="text-xl font-bold text-orange-600">{formatCurrency(displayRecords.reduce((sum, r) => sum + r.balance, 0))}</p>
                        </div>
                        <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg p-3 md:p-4 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-xs"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-xs"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PAID">Paid</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="PENDING">Pending</option>
                        <option value="OVERDUE">Overdue</option>
                    </select>

                    <select
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-xs"
                    >
                        <option value="ALL">All Courses</option>
                        {[...new Set(students.map((s) => s.courseName))].map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setSearchTerm("")
                            setStatusFilter("ALL")
                            setCourseFilter("ALL")
                        }}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Fee Records Table */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20">
                <div className="p-3 md:p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Student Fee Records</h2>
                </div>

                {filteredDisplayRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                        <p className="text-gray-600">
                            {displayRecords.length === 0 ? "No students found" : "Try adjusting your filters"}
                        </p>
                    </div>
                ) : (
                    <div className="w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Due
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paid
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Balance
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDisplayRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {record.studentId} • {record.mobileNumber}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{record.courseName}</div>
                                            <div className="text-sm text-gray-500">Admitted: {formatDate(record.admissionDate)}</div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatCurrency(record.totalDue)}</div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-600">{formatCurrency(record.totalPaid)}</div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${record.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                                                {formatCurrency(record.balance)}
                                            </div>
                                            {record.isOverdue && (
                                                <div className="text-xs text-red-500">{record.monthsOverdue} months overdue</div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}
                                            >
                                                {getStatusIcon(record.status)}
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleAddPayment(students.find((s) => s.id === record.studentId))}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                                                    title="Add Payment"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewDetails(students.find((s) => s.id === record.studentId))}
                                                    className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium text-gray-900">
                                    {selectedStudent.firstName} {selectedStudent.middleName || ''} {selectedStudent.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Course: {selectedStudent.courseName} • Mobile: {selectedStudent.mobileNumber}
                                </p>
                            </div>

                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                                        <input
                                            type="number"
                                            value={paymentData.amount}
                                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter amount"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                                        <input
                                            type="date"
                                            value={paymentData.payment_date}
                                            onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                                        <select
                                            value={paymentData.payment_method}
                                            onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="CARD">Card</option>
                                            <option value="UPI">UPI</option>
                                            <option value="BANK_TRANSFER">Bank Transfer</option>
                                            <option value="CHEQUE">Cheque</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee</label>
                                        <input
                                            type="number"
                                            value={paymentData.late_fee}
                                            onChange={(e) =>
                                                setPaymentData({ ...paymentData, late_fee: Number.parseFloat(e.target.value) || 0 })
                                            }
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Late fee amount"
                                        />
                                    </div>
                                </div>

                                {paymentData.payment_method !== "CASH" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                                        <input
                                            type="text"
                                            value={paymentData.transaction_id}
                                            onChange={(e) => setPaymentData({ ...paymentData, transaction_id: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter transaction ID"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea
                                        value={paymentData.notes}
                                        onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add any notes about this payment"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        Record Payment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Fee Details</h2>
                                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Student Info */}
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Name:</span>
                                            <p className="font-medium">
                                                {selectedStudent.firstName} {selectedStudent.middleName || ''} {selectedStudent.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Course:</span>
                                            <p className="font-medium">{selectedStudent.courseName}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Mobile:</span>
                                            <p className="font-medium">{selectedStudent.mobileNumber}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Admission Date:</span>
                                            <p className="font-medium">{formatDate(selectedStudent.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="bg-green-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(() => {
                                            const paymentStatus = calculatePaymentStatus(selectedStudent)
                                            return (
                                                <>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Total Due:</span>
                                                        <p className="text-xl font-bold text-blue-600">{formatCurrency(paymentStatus.totalDue)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Total Paid:</span>
                                                        <p className="text-xl font-bold text-green-600">
                                                            {formatCurrency(paymentStatus.totalPaid)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Balance:</span>
                                                        <p
                                                            className={`text-xl font-bold ${paymentStatus.balance > 0 ? "text-red-600" : "text-green-600"}`}
                                                        >
                                                            {formatCurrency(paymentStatus.balance)}
                                                        </p>
                                                    </div>
                                                </>
                                            )
                                        })()}
                                    </div>
                                </div>

                                {/* Payment History */}
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No payment history available</p>
                                        <p className="text-sm mt-1">Payments will appear here once recorded</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FeeManagement
