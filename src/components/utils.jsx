import React from "react";
// Shared formatting utilities for the app

// Format Aadhar number as XXXX XXXX XXXX
export function formatAadhar(aadharNumber) {
    if (!aadharNumber) return "Not provided";
    return aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
}

// Format date as 'DD MMM YYYY' or fallback to 'N/A'
export function formatDate(dateString, opts) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    // Default: 'en-IN', day:2-digit, month:short, year:numeric
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(opts || {}),
    });
}

// Format currency as INR
export function formatCurrency(amount) {
    if (isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

// Centralized status color utility
// Supported statuses: ENQUIRIES: PENDING, INTERESTED, NOT_INTERESTED, ADMITTED; FEES: PAID, PARTIAL, OVERDUE, PENDING; DOCUMENTS: UPLOADED, PENDING, REJECTED
export function getStatusColor(status) {
    switch (status) {
        // Enquiries
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "INTERESTED":
            return "bg-green-100 text-green-800 border-green-200";
        case "NOT_INTERESTED":
            return "bg-red-100 text-red-800 border-red-200";
        case "ADMITTED":
            return "bg-blue-100 text-blue-800 border-blue-200";
        // Fees
        case "PAID":
            return "bg-green-100 text-green-800 border-green-200";
        case "PARTIAL":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "OVERDUE":
            return "bg-red-100 text-red-800 border-red-200";
        // Documents
        case "UPLOADED":
            return "bg-green-100 text-green-800 border-green-200";
        case "REJECTED":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

// Centralized status icon utility
// Returns a React element for the given status
import {
    CheckCircle,
    AlertCircle,
    XCircle,
    BookOpen,
    Clock,
    AlertTriangle,
    FileText,
} from "lucide-react";
export function getStatusIcon(status) {
    switch (status) {
        // Enquiries
        case "PENDING":
            return <AlertCircle className="w-4 h-4" />;
        case "INTERESTED":
            return <CheckCircle className="w-4 h-4" />;
        case "NOT_INTERESTED":
            return <XCircle className="w-4 h-4" />;
        case "ADMITTED":
            return <BookOpen className="w-4 h-4" />;
        // Fees
        case "PAID":
            return <CheckCircle className="w-4 h-4" />;
        case "PARTIAL":
            return <Clock className="w-4 h-4" />;
        case "OVERDUE":
            return <AlertTriangle className="w-4 h-4" />;
        // Documents
        case "UPLOADED":
            return <CheckCircle className="w-4 h-4" />;
        case "REJECTED":
            return <AlertCircle className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
}
