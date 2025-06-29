import { Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import StudentEnquiryForm from "./components/StudentEnquiryForm"
import StudentAdmissionForm from "./components/StudentAdmissionForm"
import FeeReceipt from "./components/FeeReceipt"
import StudentEnquiriesList from "./components/StudentEnquiriesList"
import StudentAdmissionsList from "./components/StudentAdmissionsList"
import InstituteLogin from "./components/InstituteLogin"
import CoursesFeesManagement from "./components/CoursesFeesManagement"
import StudentFollowupTracker from "./components/StudentFollowupTracker"
import AppLayout from "./components/AppLayout"
import Dashboard from "./components/Dashboard"

function App() {
    return (
        <div>
            <ToastContainer />

            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="enquiry" element={<StudentEnquiryForm />} />
                    <Route path="admission" element={<StudentAdmissionForm />} />
                    <Route path="enquiries" element={<StudentEnquiriesList />} />
                    <Route path="admissions" element={<StudentAdmissionsList />} />
                    <Route path="receipt" element={<FeeReceipt />} />
                    <Route path="courses" element={<CoursesFeesManagement />} />
                    <Route path="followup" element={<StudentFollowupTracker />} />
                </Route>

                <Route path="/login" element={<InstituteLogin />} />
            </Routes>
        </div>
    )
}

export default App;
