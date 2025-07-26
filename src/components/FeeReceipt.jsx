import React, { useState, useEffect } from "react";
import { Printer, Download, X } from "lucide-react";
import { formatDate, formatCurrency } from "./utils.jsx";

const FeeReceipt = ({ paymentData, student, onClose }) => {
    const [instituteSettings, setInstituteSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // API base URL
    const API_BASE = import.meta.env.VITE_API_URL;

    // Fetch institute settings
    const fetchInstituteSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/settings/institute`);

            if (response.ok) {
                const data = await response.json();
                setInstituteSettings(data);
            } else {
                // If settings not found, use default values
                setInstituteSettings({
                    name: "TechSkill Training Institute",
                    address: "123 Knowledge Park, Karvenagar, Pune - 411052",
                    phone: "+91 98765 43210",
                    email: "info@techskill.edu.in",
                    website: "www.techskill.edu.in",
                    logo: null,
                });
            }
        } catch (error) {
            console.error("Error fetching institute settings:", error);
            // Use default values on error
            setInstituteSettings({
                name: "TechSkill Training Institute",
                address: "123 Knowledge Park, Karvenagar, Pune - 411052",
                phone: "+91 98765 43210",
                email: "info@techskill.edu.in",
                website: "www.techskill.edu.in",
                logo: null,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstituteSettings();
    }, []);

    // Auto-download receipt on mount
    useEffect(() => {
        if (!loading && instituteSettings) {
            handleDownload();
        }
        // Only run when loading is false and instituteSettings is set
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, instituteSettings]);

    const generateReceiptNumber = () => {
        return Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
    };

    // Get institute logo URL or placeholder
    const getInstituteLogo = () => {
        if (instituteSettings?.logo) {
            return `${API_BASE.replace("/api", "")}/uploads/${instituteSettings.logo}`;
        }
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_TV_2015.svg/512px-Logo_TV_2015.svg.png";
    };

    // Get institute name or default
    const getInstituteName = () => {
        return instituteSettings?.name || "TechSkill Training Institute";
    };

    // Get institute address or default
    const getInstituteAddress = () => {
        return (
            instituteSettings?.address ||
            "123 Knowledge Park, Karvenagar, Pune - 411052"
        );
    };

    // Get institute contact info or default
    const getInstituteContact = () => {
        const phone = instituteSettings?.phone || "+91 98765 43210";
        const email = instituteSettings?.email || "info@techskill.edu.in";
        return `Phone: ${phone} | Email: ${email}`;
    };

    // Get center code or default
    const getCenterCode = () => {
        return instituteSettings?.centerCode || "C001";
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Fee Receipt</title>
                <style>
                    @page { size: A4; margin: 12mm; }
                    body { font-family: "Segoe UI", sans-serif; font-size: 9.2pt; background: #f9f9f9; margin: 0; }
                    .container { width: 210mm; background: #fff; padding: 12mm; margin: auto; box-sizing: border-box; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8mm; }
                    .header h1 { font-size: 15pt; margin: 0; text-transform: uppercase; }
                    .subtext { font-size: 8.5pt; line-height: 1.4; color: #333; }
                    .header img { height: 60px; }
                    h2.title { text-align: center; font-size: 12pt; margin: 6mm 0 4mm; text-transform: uppercase; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 4mm; }
                    td, th { border: 1px solid #ccc; padding: 4px 6px; vertical-align: top; min-height: 18pt; }
                    th { text-align: left; background: #f3f3f3; }
                    .meta { display: flex; flex-wrap: wrap; gap: 1rem 2rem; margin-bottom: 6mm; }
                    .meta div { min-width: 180px; }
                    .totals { margin-top: 1rem; width: 100%; max-width: 300px; margin-left: auto; }
                    .totals div { display: flex; justify-content: space-between; padding: .4rem 0; }
                    .totals div.total { font-weight: 600; border-top: 1px solid #ccc; margin-top: .35rem; }
                    .notes { font-size: 8.9pt; line-height: 1.45; color: #222; margin-top: 6mm; }
                    .notes h4 { font-size: 9.5pt; margin-bottom: 2mm; }
                    ul { padding-left: 18px; margin: 0; }
                    .sign { margin-top: 1mm; display: flex; justify-content: flex-end; }
                    .sign div { text-align: center; }
                    .sign-line { margin-top: 12mm; width: 180px; border-top: 1px solid #999; }
                    @media print { body { background: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="info">
                            <h1>${getInstituteName()}</h1>
                            <div class="subtext">
                                Center Code: ${getCenterCode()}<br>
                                ${getInstituteAddress()}<br>
                                ${getInstituteContact()}
                            </div>
                        </div>
                        <img src="${getInstituteLogo()}" alt="Institute Logo">
                    </div>

                    <h2 class="title">Fee Receipt</h2>

                    <div class="meta">
                        <div><strong>Date:</strong> ${formatDate(paymentData.payment_date)}</div>
                        <div><strong>Student Name:</strong> ${student.firstName} ${student.middleName || ""} ${student.lastName}</div>
                        <div><strong>Receipt #:</strong> ${generateReceiptNumber()}</div>
                        <div><strong>Payment Mode:</strong> ${paymentData.payment_method}</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${student.courseName} Payment</td>
                                <td>${paymentData.amount}</td>
                            </tr>
                            ${
                                paymentData.late_fee > 0
                                    ? `
                            <tr>
                                <td>Late Fee</td>
                                <td>${paymentData.late_fee}</td>
                            </tr>
                            `
                                    : ""
                            }
                            ${
                                paymentData.discount > 0
                                    ? `
                            <tr>
                                <td>Discount</td>
                                <td style="color: #dc2626;">-${paymentData.discount}</td>
                            </tr>
                            `
                                    : ""
                            }
                        </tbody>
                    </table>

                    <div class="totals">
                        <div><span><strong>Total Paid:</strong></span> <span>${formatCurrency(parseFloat(paymentData.amount) + parseFloat(paymentData.late_fee || 0) - parseFloat(paymentData.discount || 0))}</span></div>
                    </div>

                    <div class="notes">
                        <h4>Notes:</h4>
                        <ul>
                            <li>Student should maintain this copy until end of examination.</li>
                            <li>Fees once paid is non-refundable and non-transferable in any circumstances.</li>
                            ${paymentData.notes ? `<li>${paymentData.notes}</li>` : ""}
                        </ul>
                    </div>

                    <div class="sign">
                        <div>
                            <div class="sign-line"></div>
                            <div>Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleDownload = () => {
        const receiptContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Fee Receipt</title>
                <style>
                    @page { size: A4; margin: 12mm; }
                    body { font-family: "Segoe UI", sans-serif; font-size: 9.2pt; background: #f9f9f9; margin: 0; }
                    .container { width: 210mm; background: #fff; padding: 12mm; margin: auto; box-sizing: border-box; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8mm; }
                    .header h1 { font-size: 15pt; margin: 0; text-transform: uppercase; }
                    .subtext { font-size: 8.5pt; line-height: 1.4; color: #333; }
                    .header img { height: 56px; }
                    h2.title { text-align: center; font-size: 12pt; margin: 6mm 0 4mm; text-transform: uppercase; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 4mm; }
                    td, th { border: 1px solid #ccc; padding: 4px 6px; vertical-align: top; min-height: 18pt; }
                    th { text-align: left; background: #f3f3f3; }
                    .meta { display: flex; flex-wrap: wrap; gap: 1rem 2rem; margin-bottom: 6mm; }
                    .meta div { min-width: 180px; }
                    .totals { margin-top: 1rem; width: 100%; max-width: 300px; margin-left: auto; }
                    .totals div { display: flex; justify-content: space-between; padding: .4rem 0; }
                    .totals div.total { font-weight: 600; border-top: 1px solid #ccc; margin-top: .35rem; }
                    .notes { font-size: 8.9pt; line-height: 1.45; color: #222; margin-top: 6mm; }
                    .notes h4 { font-size: 9.5pt; margin-bottom: 2mm; }
                    ul { padding-left: 18px; margin: 0; }
                    .sign { margin-top: 2mm; display: flex; justify-content: flex-end; }
                    .sign div { text-align: center; }
                    .sign-line { margin-top: 12mm; width: 180px; border-top: 1px solid #999; }
                    @media print { body { background: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="info">
                            <h1>${getInstituteName()}</h1>
                            <div class="subtext">
                                Center Code: ${getCenterCode()}<br>
                                ${getInstituteAddress()}<br>
                                ${getInstituteContact()}
                            </div>
                        </div>
                        <img src="${getInstituteLogo()}" alt="Institute Logo">
                    </div>

                    <h2 class="title">Fee Receipt</h2>

                    <div class="meta">
                        <div><strong>Date:</strong> ${formatDate(paymentData.payment_date)}</div>
                        <div><strong>Student Name:</strong> ${student.firstName} ${student.middleName || ""} ${student.lastName}</div>
                        <div><strong>Receipt #:</strong> ${generateReceiptNumber()}</div>
                        <div><strong>Payment Mode:</strong> ${paymentData.payment_method}</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${student.courseName} Payment</td>
                                <td>${paymentData.amount}</td>
                            </tr>
                            ${
                                paymentData.late_fee > 0
                                    ? `
                            <tr>
                                <td>Late Fee</td>
                                <td>${paymentData.late_fee}</td>
                            </tr>
                            `
                                    : ""
                            }
                            ${
                                paymentData.discount > 0
                                    ? `
                            <tr>
                                <td>Discount</td>
                                <td style="color: #dc2626;">-${paymentData.discount}</td>
                            </tr>
                            `
                                    : ""
                            }
                        </tbody>
                    </table>

                    <div class="totals">
                        <div><span><strong>Total Paid:</strong></span> <span>${formatCurrency(parseFloat(paymentData.amount) + parseFloat(paymentData.late_fee || 0) - parseFloat(paymentData.discount || 0))}</span></div>
                    </div>

                    <div class="notes">
                        <h4>Notes:</h4>
                        <ul>
                            <li>Student should maintain this copy until end of examination.</li>
                            <li>Fees once paid is non-refundable and non-transferable in any circumstances.</li>
                            ${paymentData.notes ? `<li>${paymentData.notes}</li>` : ""}
                        </ul>
                    </div>

                    <div class="sign">
                        <div>
                            <div class="sign-line"></div>
                            <div>Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([receiptContent], { type: "text/html" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fee_receipt_${student.firstName}_${student.lastName}_${formatDate(paymentData.payment_date).replace(/\s/g, "_")}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Fee Receipt
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {/* Receipt Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Receipt Preview
                            </h3>
                            <p className="text-sm text-gray-600">
                                Generated receipt for payment recording
                            </p>
                        </div>

                        {/* Institute Information */}
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-sm text-gray-600">
                                    Loading institute details...
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {getInstituteName()}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Center Code: {getCenterCode()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {getInstituteAddress()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {getInstituteContact()}
                                        </p>
                                    </div>
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <img
                                            src={getInstituteLogo()}
                                            alt="Institute Logo"
                                            className="w-20 h-20 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Student:
                                    </span>
                                    <p className="font-medium">
                                        {student.firstName}{" "}
                                        {student.middleName || ""}{" "}
                                        {student.lastName}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Course:
                                    </span>
                                    <p className="font-medium">
                                        {student.courseName}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Payment Date:
                                    </span>
                                    <p className="font-medium">
                                        {formatDate(paymentData.payment_date)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Payment Method:
                                    </span>
                                    <p className="font-medium">
                                        {paymentData.payment_method}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Amount:
                                    </span>
                                    <p className="font-medium text-green-600">
                                        {formatCurrency(paymentData.amount)}
                                    </p>
                                </div>
                                {paymentData.late_fee > 0 && (
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Late Fee:
                                        </span>
                                        <p className="font-medium text-red-600">
                                            {formatCurrency(
                                                paymentData.late_fee,
                                            )}
                                        </p>
                                    </div>
                                )}
                                {paymentData.discount > 0 && (
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Discount:
                                        </span>
                                        <p className="font-medium text-red-600">
                                            -
                                            {formatCurrency(
                                                paymentData.discount,
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">
                                        Total Amount:
                                    </span>
                                    <span className="font-bold text-lg text-green-600">
                                        {formatCurrency(
                                            parseFloat(paymentData.amount) +
                                                parseFloat(
                                                    paymentData.late_fee || 0,
                                                ) -
                                                parseFloat(
                                                    paymentData.discount || 0,
                                                ),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                        >
                            <Printer className="w-5 h-5" />
                            Print Receipt
                        </button>
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                        >
                            <Download className="w-5 h-5" />
                            Download Receipt
                        </button>
                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                        >
                            <X className="w-5 h-5" />
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeReceipt;
