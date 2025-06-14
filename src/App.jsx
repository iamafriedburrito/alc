import React from 'react'
import StudentEnquiryForm from './components/StudentEnquiryForm'
import StudentAdmissionForm from './components/StudentAdmissionForm'
import FeeReceipt from './components/FeeReceipt'
import StudentEnquiriesList from './components/StudentEnquiriesList'

function App() {
  return (
    <div>
      <StudentEnquiryForm />
      <StudentAdmissionForm />
      <FeeReceipt />
      <StudentEnquiriesList />
    </div>
  )
}

export default App
