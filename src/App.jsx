import { Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import EnquiryForm from "./components/EnquiryForm"
import AdmissionForm from "./components/AdmissionForm"
import EnquiriesList from "./components/EnquiriesList"
import StudentList from "./components/StudentList"
import InstituteLogin from "./components/InstituteLogin"
import CoursesManagement from "./components/CoursesManagement"
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
                    <Route path="enquiry" element={<EnquiryForm />} />
                    <Route path="admission" element={<AdmissionForm />} />
                    <Route path="enquiries" element={<EnquiriesList />} />
                    <Route path="admissions" element={<StudentList />} />
                    <Route path="courses" element={<CoursesManagement />} />
                    <Route path="fees" element={<FeeManagement />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="/login" element={<InstituteLogin />} />
            </Routes>
        </div>
    )
}

export default App

