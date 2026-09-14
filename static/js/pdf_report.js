/**
 * Automated Official PDF Crime Report Generator
 * Uses html2pdf.js to render a structured printable report
 */

function generateAndDownloadPDF(reportData) {
    // Ensure html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => buildAndSavePDF(reportData);
        document.head.appendChild(script);
    } else {
        buildAndSavePDF(reportData);
    }
}

function buildAndSavePDF(data) {
    const district = data.district || 'DISTRICT ANALYZED';
    const state = data.state || 'INDIA';
    const zone = data.zone || 'ORANGE ZONE';
    const riskScore = data.risk_score || 50;
    const totalIPC = data.total_ipc || 'N/A';
    const murder = data.murder || 0;
    const rape = data.rape || 0;
    const theft = data.theft || 0;
    const robbery = data.robbery || 0;
    const hurt = data.hurt || 0;
    const topCrime = data.top_crime || 'General Theft';
    const advice = data.advice || 'Standard vigilance recommended in public areas.';
    
    const zoneBg = zone.includes('RED') ? '#fee2e2' : (zone.includes('GREEN') ? '#d1fae5' : '#fef3c7');
    const zoneColor = zone.includes('RED') ? '#b91c1c' : (zone.includes('GREEN') ? '#047857' : '#b45309');
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const reportID = 'CR-PDF-' + Math.floor(100000 + Math.random() * 900000);

    const reportHTML = `
    <div id="pdf-report-template" style="padding: 30px; font-family: 'Helvetica', 'Arial', sans-serif; color: #1e293b; background: #ffffff;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #6366f1; padding-bottom: 15px; margin-bottom: 20px;">
            <div>
                <h1 style="font-size: 22px; font-weight: 800; color: #1e1b4b; margin: 0;">NATIONAL CRIME ANALYTICS AI</h1>
                <p style="font-size: 11px; color: #64748b; margin: 3px 0 0 0;">INTELLIGENCE & PREDICTIVE SAFETY REPORT</p>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 10px; font-weight: bold; background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 4px;">OFFICIAL REPORT</span>
                <p style="font-size: 10px; color: #64748b; margin: 4px 0 0 0;">ID: ${reportID}</p>
                <p style="font-size: 10px; color: #64748b; margin: 2px 0 0 0;">Date: ${currentDate}</p>
            </div>
        </div>

        <!-- Target District Banner -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <p style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; margin: 0;">LOCATION ASSESSED</p>
                <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 2px 0 0 0;">${district.toUpperCase()}</h2>
                <p style="font-size: 12px; color: #475569; margin: 2px 0 0 0;">State / UT: ${state.toUpperCase()}</p>
            </div>
            <div style="text-align: right;">
                <div style="background: ${zoneBg}; color: ${zoneColor}; font-weight: 900; font-size: 14px; padding: 8px 16px; border-radius: 6px; display: inline-block;">
                    ${zone}
                </div>
                <p style="font-size: 11px; font-weight: bold; color: #334155; margin: 5px 0 0 0;">Risk Score: ${riskScore} / 100</p>
            </div>
        </div>

        <!-- Metric Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
            <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; text-align: center;">
                <p style="font-size: 10px; color: #64748b; margin: 0;">TOTAL RECORDED CRIMES</p>
                <p style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">${totalIPC}</p>
            </div>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; text-align: center;">
                <p style="font-size: 10px; color: #64748b; margin: 0;">PRIMARY THREAT TYPE</p>
                <p style="font-size: 14px; font-weight: 800; color: #b91c1c; margin: 6px 0 0 0;">${topCrime}</p>
            </div>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; text-align: center;">
                <p style="font-size: 10px; color: #64748b; margin: 0;">CLASSIFICATION MODEL</p>
                <p style="font-size: 14px; font-weight: 800; color: #4338ca; margin: 6px 0 0 0;">K-Means & Random Forest</p>
            </div>
        </div>

        <!-- Crime Category Breakdown Table -->
        <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 10px;">STATISTICAL CRIME BREAKDOWN</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
            <thead>
                <tr style="background: #e2e8f0; color: #334155;">
                    <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Crime Category</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;">Recorded Incidents</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Severity Level</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Homicide / Murder</td>
                    <td style="padding: 6px 8px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${murder}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #b91c1c;">High Critical</td>
                </tr>
                <tr>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Women Related Crimes / Rape</td>
                    <td style="padding: 6px 8px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${rape}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #b91c1c;">High Critical</td>
                </tr>
                <tr>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Theft & Property Offenses</td>
                    <td style="padding: 6px 8px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${theft}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #d97706;">Moderate</td>
                </tr>
                <tr>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Robbery & Dacoity</td>
                    <td style="padding: 6px 8px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${robbery}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #d97706;">Moderate</td>
                </tr>
                <tr>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Assault / Hurt</td>
                    <td style="padding: 6px 8px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${hurt}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #2563eb;">Standard</td>
                </tr>
            </tbody>
        </table>

        <!-- Safety Advisory Section -->
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
            <h4 style="font-size: 12px; font-weight: 700; color: #1e40af; margin: 0 0 4px 0;">DISTRICT SAFETY RECOMMENDATION</h4>
            <p style="font-size: 11px; color: #1e3a8a; margin: 0; line-height: 1.4;">${advice}</p>
        </div>

        <!-- Emergency Directory -->
        <div style="background: #fdf2f8; border: 1px dashed #f472b6; padding: 12px; border-radius: 6px; margin-bottom: 25px;">
            <h4 style="font-size: 11px; font-weight: 700; color: #9d174d; margin: 0 0 6px 0;">NATIONAL EMERGENCY DIRECTORY</h4>
            <p style="font-size: 10px; color: #be185d; margin: 0;">
                <strong>112</strong> National Emergency Response System | 
                <strong>1091</strong> Women Helpline | 
                <strong>1930</strong> Cyber Crime Reporting | 
                <strong>1098</strong> Child Helpline
            </p>
        </div>

        <!-- Footer / Signature Stamp -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #cbd5e1; padding-top: 15px; margin-top: 20px;">
            <div>
                <p style="font-size: 9px; color: #94a3b8; margin: 0;">Generated automatically by Crime Analytics AI System.</p>
                <p style="font-size: 9px; color: #94a3b8; margin: 2px 0 0 0;">Dataset Source: National Crime Records Bureau (NCRB) & ML Model Engines.</p>
            </div>
            <div style="text-align: center;">
                <div style="border: 2px dashed #6366f1; padding: 4px 12px; border-radius: 4px; color: #4f46e5; font-size: 10px; font-weight: 900; letter-spacing: 1px;">
                    VERIFIED & SEALED
                </div>
            </div>
        </div>
    </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = reportHTML;
    document.body.appendChild(element);

    const opt = {
        margin:       0.3,
        filename:     `Crime_Report_${district.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
    }).catch(err => {
        console.error("PDF generation error:", err);
        document.body.removeChild(element);
    });
}
