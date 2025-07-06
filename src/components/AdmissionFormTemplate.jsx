// Admission Form HTML Template
export const generateAdmissionFormHTML = (formData, admissionId, photoPreview, signaturePreview, instituteSettings, API_BASE) => {
    // Helper functions for institute details
    const getInstituteLogo = () => {
        if (instituteSettings?.logo) {
            return `${API_BASE.replace('/api', '')}/uploads/${instituteSettings.logo}`;
        }
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_TV_2015.svg/512px-Logo_TV_2015.svg.png";
    };

    const getInstituteName = () => {
        return instituteSettings?.name || 'TechSkill Training Institute';
    };

    const getInstituteAddress = () => {
        return instituteSettings?.address || '123 Knowledge Park, Karvenagar, Pune - 411052';
    };

    const getInstituteContact = () => {
        const phone = instituteSettings?.phone || '+91 98765 43210';
        const email = instituteSettings?.email || 'info@techskill.edu.in';
        return `Phone: ${phone} | Email: ${email}`;
    };

    const getCenterCode = () => {
        return instituteSettings?.centerCode || 'C001';
    };

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Admission Form</title>
          <style>
            /* ---------- PAGE & GLOBALS ---------- */
            @page          { size:A4; margin:12mm; }
            body           { font-family:"Segoe UI",sans-serif; font-size:9.2pt; background:#f9f9f9; margin:0; }
            .container     { width:210mm; background:#fff; padding:12mm; margin:auto; box-sizing:border-box; }

            /* ---------- HEADER ---------- */
            .header        { display:flex; justify-content:space-between; align-items:center;
                             border-bottom:2px solid #000; padding-bottom:6px; margin-bottom:8mm; }
            .header h1     { font-size:15pt; margin:0; text-transform:uppercase; }
            .subtext       { font-size:8.5pt; line-height:1.4; color:#333; }
            .header img    { height:60px; }

            /* ---------- SECTION TITLES ---------- */
            h2.title       { text-align:center; font-size:12pt; margin:6mm 0 4mm; text-transform:uppercase; }
            .section-title { font-weight:600; font-size:10pt; margin:4mm 0 2mm;
                             color:#222; border-bottom:1px solid #ccc; padding-bottom:1mm; }

            /* ---------- TABLE ---------- */
            table          { width:100%; border-collapse:collapse; margin-bottom:4mm; }
            td             { border:1px solid #ccc; padding:4px 6px; vertical-align:top; min-height:18pt; }
            .td-label      { width:33%; font-weight:600; background:#f3f3f3; }

            /* ---------- PHOTO / SIGNATURE ---------- */
            .photo, .signature { border:1px solid #888; display:flex; align-items:center; justify-content:center; background:#fff; }
            .photo        { width:35mm; height:45mm; }   /* 35 × 45 mm Indian passport size */
            .signature    { width:35mm; height:15mm; }   /* slim sign box */
            .photo img, .signature img { max-width:100%; max-height:100%; }

            /* ---------- NOTES ---------- */
            .notes         { font-size:7pt; line-height:1.45; color:#222; }
            .notes strong  { display:inline-block; margin:5mm 0 2mm; font-size:9.5pt; text-decoration:underline; }
            ul             { padding-left:18px; margin:0; }

            /* ---------- OFFICIAL SIGNATURES ---------- */
            .signature-section { display: flex; justify-content: space-between; margin-top: 6mm; padding-top: 10mm; }
            .signature-line { width: 40mm; border-top: 1px solid #000; margin-top: 15px; text-align: center; font-size: 8.5pt; padding-top: 2px; }

            @media print   { body{background:none;} }
          </style>
        </head>
        <body>
          <div class="container">

            <!-- ===== HEADER ===== -->
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

            <h2 class="title">Admission Form - ID: ${admissionId}</h2>

            <!-- ===== 1. PERSONAL DETAILS ===== -->
            <div class="section-title">1 · Personal Details</div>
            <div style="display:flex; justify-content:space-between; gap:2mm; margin-bottom:4mm;">

              <!-- LEFT: DETAILS TABLE -->
              <table style="flex:1;">
                <tr><td class="td-label">First Name</td>          <td>${formData.firstName}</td></tr>
                <tr><td class="td-label">Middle Name</td>         <td>${formData.middleName}</td></tr>
                <tr><td class="td-label">Last Name</td>           <td>${formData.lastName}</td></tr>
                <tr><td class="td-label">Name on Certificate</td> <td>${formData.certificateName}</td></tr>
                <tr><td class="td-label">Date of Birth</td>       <td>${formData.dateOfBirth}</td></tr>
                <tr><td class="td-label">Gender</td>              <td>${formData.gender}</td></tr>
                <tr><td class="td-label">Marital Status</td>      <td>${formData.maritalStatus}</td></tr>
                <tr><td class="td-label">Mother Tongue</td>       <td>${formData.motherTongue}</td></tr>
                <tr><td class="td-label">Nationality</td>         <td>INDIAN</td></tr>
                <tr><td class="td-label">Aadhaar Number</td>      <td>${formData.aadharNumber}</td></tr>
              </table>

              <!-- RIGHT: PHOTO + SIGN -->
              <div style="width:38mm; display:flex; flex-direction:column; justify-content:flex-start; gap:1mm;">
                <div class="photo">
                  ${photoPreview ? `<img src="${photoPreview}" alt="Photo">` : '<span>Photo</span>'}
                </div>
                <div class="signature">
                  ${signaturePreview ? `<img src="${signaturePreview}" alt="Signature">` : '<span>Signature</span>'}
                </div>
              </div>
            </div>

            <!-- ===== 2. ADDRESS ===== -->
            <div class="section-title">2 · Address for Correspondence</div>
            <table>
              <tr><td class="td-label">Address</td> <td>${formData.correspondenceAddress}</td></tr>
              <tr><td class="td-label">City</td>    <td>${formData.city}</td></tr>
              <tr><td class="td-label">District</td><td>${formData.district}</td></tr>
              <tr><td class="td-label">State</td>   <td>${formData.state}</td></tr>
            </table>

            <!-- ===== 3. CONTACT ===== -->
            <div class="section-title">3 · Contact Information</div>
            <table>
              <tr><td class="td-label">Mobile Number</td>    <td>+91 ${formData.mobileNumber}</td></tr>
              <tr><td class="td-label">Alternate Mobile</td> <td>+91 ${formData.alternateMobileNumber}</td></tr>
            </table>

            <!-- ===== 4. EDUCATION ===== -->
            <div class="section-title">4 · Educational & Course Details</div>
            <table>
              <tr><td class="td-label">Category</td>                 <td>${formData.category}</td></tr>
              <tr><td class="td-label">Educational Qualification</td><td>${formData.educationalQualification}</td></tr>
              <tr><td class="td-label">Course Name</td>              <td>${formData.courseName}</td></tr>
              <tr><td class="td-label">Preferred Timing</td>         <td>${formData.timing}</td></tr>
              <tr><td class="td-label">Referred By</td>              <td>${formData.referredBy}</td></tr>
            </table>

            <!-- ===== 5. TERMS ===== -->
            <div class="section-title">5 · Terms and Affirmation</div>
            <div class="notes">
              <ul>
                <li>Fees are non-refundable under any circumstances.</li>
                <li>Admission may be cancelled if the student is absent for an extended period without a leave application.</li>
                <li>Admission may be cancelled due to misbehavior in class.</li>
                <li>Failure to pay fees monthly will incur a penalty, and the final exam date may be extended.</li>
              </ul>
              <p>
                I solemnly affirm that my name, photograph, and signature on this form match the details on my proof of identity, and that I have understood the information provided about the course.
              </p>
            </div>

            <!-- ===== OFFICIAL SIGNATURES ===== -->
            <div class="signature-section">
              <div class="signature-line">Faculty Coordinator</div>
              <div class="signature-line">Center Coordinator</div>
            </div>

          </div>
        </body>
        </html>
    `;
}; 
