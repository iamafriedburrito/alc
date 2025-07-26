import React from "react";
import { X, Save } from "lucide-react";

const RecordPaymentModal = ({
    open,
    onClose,
    student,
    paymentData,
    setPaymentData,
    paymentStatus,
    onSubmit,
    toast,
}) => {
    if (!open || !student) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Record Payment
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-gray-900">
                            {student.firstName} {student.middleName || ""}{" "}
                            {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Course: {student.courseName} • Mobile:{" "}
                            {student.mobileNumber}
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount *
                                </label>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(
                                            /[^0-9]/g,
                                            "",
                                        );
                                        if (
                                            Number(value) >
                                            paymentStatus.balance
                                        ) {
                                            value = paymentStatus.balance;
                                            toast &&
                                                toast.warn(
                                                    "Amount cannot exceed the balance due.",
                                                );
                                        }
                                        setPaymentData({
                                            ...paymentData,
                                            amount: value,
                                        });
                                    }}
                                    required
                                    min="0"
                                    max={paymentStatus.balance}
                                    step="1"
                                    className="no-spinner w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter amount"
                                    onKeyDown={(e) => {
                                        if (e.key === "." || e.key === ",")
                                            e.preventDefault();
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Date *
                                </label>
                                <input
                                    type="date"
                                    value={paymentData.payment_date}
                                    onChange={(e) =>
                                        setPaymentData({
                                            ...paymentData,
                                            payment_date: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method *
                                </label>
                                <select
                                    value={paymentData.payment_method}
                                    onChange={(e) =>
                                        setPaymentData({
                                            ...paymentData,
                                            payment_method: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="CARD">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="BANK_TRANSFER">
                                        Bank Transfer
                                    </option>
                                    <option value="CHEQUE">Cheque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Late Fee
                                </label>
                                <input
                                    type="number"
                                    value={paymentData.late_fee}
                                    onChange={(e) =>
                                        setPaymentData({
                                            ...paymentData,
                                            late_fee:
                                                Number.parseFloat(
                                                    e.target.value,
                                                ) || 0,
                                        })
                                    }
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Late fee amount"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount
                                </label>
                                <input
                                    type="text"
                                    value={paymentData.discount}
                                    onChange={(e) => {
                                        // Only allow digits
                                        let value = e.target.value.replace(
                                            /[^0-9]/g,
                                            "",
                                        );
                                        let intValue = parseInt(value) || 0;
                                        const maxDiscount = Math.min(
                                            paymentStatus.balance,
                                            paymentData.amount || 0,
                                        );
                                        if (intValue > maxDiscount) {
                                            intValue = maxDiscount;
                                            toast &&
                                                toast.warn(
                                                    "Discount cannot exceed the payment amount.",
                                                );
                                        }
                                        setPaymentData({
                                            ...paymentData,
                                            discount: intValue,
                                        });
                                    }}
                                    min="0"
                                    max={Math.min(
                                        paymentStatus.balance,
                                        paymentData.amount || 0,
                                    )}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Discount amount"
                                />
                            </div>
                        </div>

                        {paymentData.payment_method !== "CASH" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction ID
                                </label>
                                <input
                                    type="text"
                                    value={paymentData.transaction_id}
                                    onChange={(e) =>
                                        setPaymentData({
                                            ...paymentData,
                                            transaction_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter transaction ID"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                value={paymentData.notes}
                                onChange={(e) =>
                                    setPaymentData({
                                        ...paymentData,
                                        notes: e.target.value,
                                    })
                                }
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
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
