import React from "react";
import { Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import StudentEnquiryForm from "./components/StudentEnquiryForm";
import StudentAdmissionForm from "./components/StudentAdmissionForm";
import FeeReceipt from "./components/FeeReceipt";
import StudentEnquiriesList from "./components/StudentEnquiriesList";
import StudentAdmissionsList from "./components/StudentAdmissionsList";
import InstituteLogin from "./components/InstituteLogin";
import CoursesFeesManagement from "./components/CoursesFeesManagement";
import StudentFollowupTracker from "./components/StudentFollowupTracker";

function App() {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<InstituteLogin />} />
                <Route path="/enquiry" element={<StudentEnquiryForm />} />
                <Route path="/admission" element={<StudentAdmissionForm />} />
                <Route path="/fee-receipt" element={<FeeReceipt />} />
                <Route path="/enquiry-list" element={<StudentEnquiriesList />} />
                <Route path="/admission-list" element={<StudentAdmissionsList />} />
                <Route path="/courses-fees" element={<CoursesFeesManagement />} />
                <Route path="/followup-tracker" element={<StudentFollowupTracker />} />
            </Routes>
        </div>
    );
}

export default App;
