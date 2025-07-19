import React from "react";
import { X } from "lucide-react";

const DocumentPreviewModal = ({ showPreview, previewFile, onClose }) => {
    if (!showPreview || !previewFile?.type === "pdf") return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-sm max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-4">
                    <iframe
                        src={previewFile.url}
                        className="w-full h-[80vh] border border-gray-200 rounded-lg"
                        title="Document Preview"
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal; 