import React, { useState } from "react";

const FeeReceipt = () => {
    const [formData, setFormData] = useState({
        date: "",
        receiptNumber: "",
        receivedFrom: "",
        amount: "",
        amountInWords: "",
        paymentMethod: "cash",
        chequeDdNumber: "",
        chequeDdDate: "",
        drawnOn: "",
        courseName: "",
        startDate: "",
        batchNo: "",
        time: "",
        balance: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .receipt-container, .receipt-container * {
                        visibility: visible;
                    }
                    .receipt-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        margin: 0;
                        box-shadow: none;
                        border: none;
                    }
                    .no-print {
                        display: none;
                    }
                }
                `}
            </style>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 receipt-container">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Fee Receipt
                        </h2>
                        <p className="text-gray-600">Center Code: xxxxxxxx</p>
                    </div>

                    <div className="flex justify-end mb-4">
                        <div className="text-sm text-gray-600">
                            <p>Contact:</p>
                            <p>+91 9999999999</p>
                            <p>+91 8888888888</p>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="date"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="receiptNumber"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Receipt Number
                                    </label>
                                    <input
                                        type="text"
                                        id="receiptNumber"
                                        name="receiptNumber"
                                        value={formData.receiptNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Receipt No."
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="receivedFrom"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Received with thanks from
                                </label>
                                <input
                                    type="text"
                                    id="receivedFrom"
                                    name="receivedFrom"
                                    value={formData.receivedFrom}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    placeholder="Student Name"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="amount"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="amountInWords"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Amount in Words
                                    </label>
                                    <input
                                        type="text"
                                        id="amountInWords"
                                        name="amountInWords"
                                        value={formData.amountInWords}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Rupees in words"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="paymentMethod"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Payment Method
                                    </label>
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="dd">Demand Draft</option>
                                    </select>
                                </div>
                                {formData.paymentMethod !== "cash" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cheque/DD No. & Date
                                        </label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                name="chequeDdNumber"
                                                value={formData.chequeDdNumber}
                                                onChange={handleChange}
                                                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                                placeholder="Number"
                                            />
                                            <input
                                                type="date"
                                                name="chequeDdDate"
                                                value={formData.chequeDdDate}
                                                onChange={handleChange}
                                                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {formData.paymentMethod !== "cash" && (
                                <div>
                                    <label
                                        htmlFor="drawnOn"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Drawn On
                                    </label>
                                    <input
                                        type="text"
                                        id="drawnOn"
                                        name="drawnOn"
                                        value={formData.drawnOn}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Bank Name"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="courseName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Course Name
                                    </label>
                                    <select
                                        id="courseName"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value="">Select course</option>
                                        <option value="web-development">Web Development</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="machine-learning">Machine Learning</option>
                                        <option value="mobile-development">
                                            Mobile Development
                                        </option>
                                        <option value="digital-marketing">Digital Marketing</option>
                                        <option value="graphic-design">Graphic Design</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="startDate"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Starting On
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="batchNo"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Batch No
                                    </label>
                                    <input
                                        type="text"
                                        id="batchNo"
                                        name="batchNo"
                                        value={formData.batchNo}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="Batch Number"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="time"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Time
                                    </label>
                                    <input
                                        type="text"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                        placeholder="e.g., 9:00 AM - 12:00 PM"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="balance"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Balance (₹)
                                </label>
                                <input
                                    type="number"
                                    id="balance"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm"
                                    placeholder="Balance Amount"
                                />
                            </div>

                            <div className="border-2 border-blue-500 p-4 rounded-xl">
                                <p className="text-sm font-medium text-gray-700">
                                    Amount Paid: ₹{formData.amount || "0"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <p className="text-sm text-gray-600">
                                    Student should maintain this copy until end of examination
                                </p>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">
                                        Seal and Signature
                                    </p>
                                    <div className="w-32 h-16 border border-gray-200 rounded-lg mt-2"></div>
                                </div>
                            </div>

                            <p className="text-sm text-red-600 italic mt-4">
                                Note: Fees once paid is non-refundable and non-transferable in
                                any circumstances
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="no-print mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeeReceipt;
