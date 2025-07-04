import { Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import StudentEnquiryForm from "./components/StudentEnquiryForm"
import StudentAdmissionForm from "./components/StudentAdmissionForm"
import StudentEnquiriesList from "./components/StudentEnquiriesList"
import StudentAdmissionsList from "./components/StudentAdmissionsList"
import InstituteLogin from "./components/InstituteLogin"
import CoursesFeesManagement from "./components/CoursesFeesManagement"
import StudentFollowupTracker from "./components/StudentFollowupTracker"
import SettingsPage from "./components/SettingsPage"
import FeeManagement from "./components/FeeManagement"
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
                    <Route path="courses" element={<CoursesFeesManagement />} />
                    <Route path="followup" element={<StudentFollowupTracker />} />
                    <Route path="fees" element={<FeeManagement />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="/login" element={<InstituteLogin />} />
            </Routes>
        </div>
    )
}

export default App

