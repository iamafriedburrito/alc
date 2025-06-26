import React, { useEffect, useState } from "react";

const Row = ({ label, value }) => (
  <tr className="border border-gray-300">
    <td className="px-2 py-1 font-medium text-sm text-gray-700 w-48 align-top bg-gray-50">{label}</td>
    <td className="px-2 py-1 text-sm text-gray-900">{value}</td>
  </tr>
);

const SectionTable = ({ title, rows, extraContent }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold text-indigo-800 mb-2 uppercase">{title}</h3>
    <table className="w-full border border-gray-300 text-left rounded-sm overflow-hidden">
      <tbody>
        {rows.map((row, index) => (
          <Row key={index} label={row.label} value={row.value} />
        ))}
        {extraContent && (
          <tr>
            <td colSpan="2" className="px-2 py-2">{extraContent}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const StudentAdmissionPrint = () => {
  const admissionId = 2;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/admission/${admissionId}`);
        if (!res.ok) throw new Error("Failed to fetch admission");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdmission();
  }, []);

  if (!data) return <p className="text-center text-gray-500 mt-10 text-sm">Loading...</p>;

  return (
    <div className="bg-white px-6 py-6 text-[13px] text-gray-900 print:text-black print:bg-white">
      <div className="text-center mb-4">
        <img src="/logo192.png" alt="Logo" className="w-14 h-14 mx-auto mb-1" />
        <h1 className="text-xl font-bold text-indigo-800">ABC Institute of Technology</h1>
        <p className="text-xs text-gray-700">Recognized by XYZ Board | Affiliated with PQR</p>
        <h2 className="mt-2 text-lg font-semibold uppercase">Student Admission Form</h2>
      </div>

      <SectionTable
        title="Personal Information"
        rows={[
          { label: "First Name:", value: data.firstName },
          { label: "Middle Name:", value: data.middleName },
          { label: "Last Name:", value: data.lastName },
          { label: "Certificate Name:", value: data.certificateName },
          { label: "Date of Birth:", value: data.dateOfBirth },
          { label: "Admission Date:", value: data.admissionDate },
          { label: "Aadhaar Number:", value: data.aadharNumber }
        ]}
        extraContent={
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-4"></div>
            <div className="col-span-1 flex flex-col items-center">
              <img
                src={`http://localhost:8000/uploads/${data.photoFilename}`}
                alt="Photo"
                className="w-[28mm] h-[35mm] object-cover border border-gray-400"
              />
              <p className="text-xs mt-1">Photo</p>
              <img
                src={`http://localhost:8000/uploads/${data.signatureFilename}`}
                alt="Signature"
                className="w-[28mm] h-auto border border-gray-400 mt-3"
              />
              <p className="text-xs mt-1">Signature</p>
            </div>
          </div>
        }
      />

      <SectionTable
        title="Address"
        rows={[
          { label: "Address:", value: data.correspondenceAddress },
          { label: "City:", value: data.city },
          { label: "District:", value: data.district },
          { label: "State:", value: data.state }
        ]}
      />

      <SectionTable
        title="Contact Information"
        rows={[
          { label: "Mobile Number:", value: `+91 ${data.mobileNumber}` },
          { label: "Alternate Number:", value: `+91 ${data.alternateMobileNumber}` }
        ]}
      />

      <SectionTable
        title="Course & Additional Information"
        rows={[
          { label: "Course:", value: data.courseName },
          { label: "Qualification:", value: data.educationalQualification },
          { label: "Referred By:", value: data.referredBy },
          { label: "Joined WhatsApp:", value: data.joinedWhatsApp ? "Yes" : "No" }
        ]}
      />

      <div className="mb-6">
        <h3 className="text-sm font-bold text-indigo-800 mb-2 uppercase">Terms and Conditions</h3>
        <table className="w-full border border-gray-300">
          <tbody>
            <tr className="border border-gray-300">
              <td className="p-2 text-[11px]">
                <ul className="list-disc list-inside">
                  <li>Fees are non-refundable under any circumstances.</li>
                  <li>Admission may be cancelled if the student is absent without leave.</li>
                  <li>Admission may be cancelled due to misbehavior in class.</li>
                  <li>Late fee payment may result in penalty or delayed exam date.</li>
                </ul>
                <p className="mt-2">
                  <label className="inline-flex items-start gap-2">
                    <input type="checkbox" className="mt-1" readOnly />
                    I affirm the above details are correct and I agree to the terms.
                  </label>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 text-center text-[11px] mt-8">
        <div>
          <div className="border-t border-black w-40 mx-auto mb-1 h-0.5" />
          <p>Administrator Signature</p>
        </div>
        <div>
          <div className="border-t border-black w-40 mx-auto mb-1 h-0.5" />
          <p>Senior Faculty Signature</p>
        </div>
      </div>

      <div className="no-print:hidden print:hidden flex justify-center mt-6">
        <button
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-4 py-2 rounded font-medium shadow hover:bg-indigo-700"
        >
          🖨️ Print Form
        </button>
      </div>
    </div>
  );
};

export default StudentAdmissionPrint;
