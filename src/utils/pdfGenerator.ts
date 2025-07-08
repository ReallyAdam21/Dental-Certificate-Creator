import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DENTAL CERTIFICATE</title>
    <style>
        body {
            font-family: "Times New Roman", serif;
            margin: 40px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .clinic-info {
            font-size: 14px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-top: 20px;
            text-decoration: underline;
        }
        .section {
            margin-top: 30px;
            font-size: 18px;
        }
        .checkbox {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 1px solid #000;
            margin-right: 10px;
            text-align: center;
            vertical-align: middle;
            font-weight: bold;
            font-size: 16px;
        }
        .tooth-grid {
            margin-top: 20px;
            font-family: monospace;
            font-size: 17px;
            text-align: center;
        }
        .tooth-number {
            display: inline-block;
            width: 24px;
            margin: 4px;
            padding: 2px;
            border-radius: 4px;
        }
        .highlight {
            background-color: #c6f5c6;
            font-weight: bold;
            border: 1px solid #333;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 16px;
        }
        .signature {
            margin-top: 60px;
            display: flex;
            justify-content: center;
            font-size: 16px;
        }
        .signature table {
            width: 100%;
            text-align: center;
            border-collapse: collapse;
        }
        .signature td {
            padding: 10px;
            position: relative;
        }
        .line {
            border-top: 1px solid black;
            width: 200px;
            position: absolute;
            top: -10px;
            left: 26%;
            transform: translateX(-20%);
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>TANGLAO DENTAL CLINIC</h1>
        <div class="clinic-info">
            MacArthur Hi-Way, Sto. Domingo I, Capas, Tarlac<br>
            Tel. No.: 045-493-3454 | Cell No.: 0928-9950-488
        </div>
        <div class="title">CERTIFICATE OF DENTAL TREATMENT</div>
    </div>

    <div class="section">
        <strong>Date:</strong> <strong>{{ date }}</strong>
        <p>To Whom It May Concern:</p>
        <p>This is to certify that Mr./Ms. <strong>{{ patient_name }}</strong> has undergone dental treatment and received the following services:</p>

        <p><span class="checkbox">{% if scaling %}✔{% endif %}</span> Thorough scaling and polishing</p>
        <p><span class="checkbox">{% if filling %}✔{% endif %}</span> Tooth filling as indicated below:</p>

        {% if filling %}
        <div class="tooth-grid">
            <!-- Upper Row -->
            {% for tooth in ["18","17","16","15","14","13","12","11"] %}
                <span class="tooth-number {% if tooth in selected_teeth %}highlight{% endif %}">{{ tooth }}</span>
            {% endfor %}
            <span style="margin: 0 12px;">:</span>
            {% for tooth in ["21","22","23","24","25","26","27","28"] %}
                <span class="tooth-number {% if tooth in selected_teeth %}highlight{% endif %}">{{ tooth }}</span>
            {% endfor %}
            <br>
            <!-- Lower Row -->
            {% for tooth in ["48","47","46","45","44","43","42","41"] %}
                <span class="tooth-number {% if tooth in selected_teeth %}highlight{% endif %}">{{ tooth }}</span>
            {% endfor %}
            <span style="margin: 0 12px;">:</span>
            {% for tooth in ["31","32","33","34","35","36","37","38"] %}
                <span class="tooth-number {% if tooth in selected_teeth %}highlight{% endif %}">{{ tooth }}</span>
            {% endfor %}
        </div>
        {% endif %}

        <p><span class="checkbox">{% if gingival %}✔{% endif %}</span> Gingival / Periodontal Treatment</p>
        <p><span class="checkbox">{% if extraction %}✔{% endif %}</span> Tooth Extraction</p>
        <p><span class="checkbox">{% if others %}✔{% endif %}</span> Others: <strong><em>{{ other_details }}</em></strong></p>

        <p>This certification is issued upon the request of the above-named patient for whatever purpose it may serve.</p>
        <br><br><br><br><br><br><br><br>
    </div>

    <div class="signature">
        <table>
            <tr>
                <td>
                    <div class="line"></div>
                    Dr. Naomi Tanglao-Cortez
                </td>
                <td>
                    <div class="line"></div>
                    Dr. Adonis E. Cortez
                </td>
            </tr>
            <tr>
                <td>PRC # 40879</td>
                <td>PRC # 37378</td>
            </tr>
        </table>
    </div>
</body>
</html>`;

const generateToothGrid = (selectedTeeth: Set<string>, showGrid: boolean) => {
  if (!showGrid) return '';
  
  const upperTeeth = ["18", "17", "16", "15", "14", "13", "12", "11"];
  const upperTeethRight = ["21", "22", "23", "24", "25", "26", "27", "28"];
  const lowerTeeth = ["48", "47", "46", "45", "44", "43", "42", "41"];
  const lowerTeethRight = ["31", "32", "33", "34", "35", "36", "37", "38"];

  return `<div class="tooth-grid">
    ${upperTeeth.map(tooth => 
      `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
    ).join('')}
    <span style="margin: 0 12px;">:</span>
    ${upperTeethRight.map(tooth => 
      `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
    ).join('')}
    <br>
    ${lowerTeeth.map(tooth => 
      `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
    ).join('')}
    <span style="margin: 0 12px;">:</span>
    ${lowerTeethRight.map(tooth => 
      `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
    ).join('')}
  </div>`;
};

export const generateCertificatePDF = async (
  patientName: string,
  date: string,
  services: any,
  otherDetails: string,
  selectedTeeth: Set<string>
) => {
  // Convert Jinja template to simple replaceable format
  let processedHtml = htmlTemplate;
  
  // First handle the conditional tooth grid section
  if (services.filling) {
    const upperTeeth = ["18", "17", "16", "15", "14", "13", "12", "11"];
    const upperTeethRight = ["21", "22", "23", "24", "25", "26", "27", "28"];
    const lowerTeeth = ["48", "47", "46", "45", "44", "43", "42", "41"];
    const lowerTeethRight = ["31", "32", "33", "34", "35", "36", "37", "38"];

    const toothGridHtml = `
        <div class="tooth-grid">
            <!-- Upper Row -->
            ${upperTeeth.map(tooth => 
              `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
            ).join('')}
            <span style="margin: 0 12px;">:</span>
            ${upperTeethRight.map(tooth => 
              `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
            ).join('')}
            <br>
            <!-- Lower Row -->
            ${lowerTeeth.map(tooth => 
              `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
            ).join('')}
            <span style="margin: 0 12px;">:</span>
            ${lowerTeethRight.map(tooth => 
              `<span class="tooth-number ${selectedTeeth.has(tooth) ? 'highlight' : ''}">${tooth}</span>`
            ).join('')}
        </div>`;
    
    // Replace the entire conditional block with the generated HTML
    processedHtml = processedHtml.replace(
      /{% if filling %}[\s\S]*?{% endif %}/g, 
      toothGridHtml
    );
  } else {
    // Remove the tooth grid section completely
    processedHtml = processedHtml.replace(/{% if filling %}[\s\S]*?{% endif %}/g, '');
  }

  // Now replace all the simple variables and checkboxes
  let html = processedHtml
    .replace(/{{ date }}/g, date)
    .replace(/{{ patient_name }}/g, patientName)
    .replace(/{% if scaling %}✔{% endif %}/g, services.scaling ? '✔' : '')
    .replace(/{% if filling %}✔{% endif %}/g, services.filling ? '✔' : '')
    .replace(/{% if gingival %}✔{% endif %}/g, services.gingival ? '✔' : '')
    .replace(/{% if extraction %}✔{% endif %}/g, services.extraction ? '✔' : '')
    .replace(/{% if others %}✔{% endif %}/g, services.others ? '✔' : '')
    .replace(/{{ other_details }}/g, services.others ? otherDetails : '');

  // Create a temporary div to render the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.background = 'white';
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    const filename = `${patientName.replace(/\s+/g, '_')}_Dental_Certificate.pdf`;
    pdf.save(filename);
    
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};

export const generateCertificateData = (
  patientName: string,
  date: string,
  services: any,
  otherDetails: string,
  selectedTeeth: Set<string>
) => {
  const upperTeeth = ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"];
  const lowerTeeth = ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"];

  const upperRow = upperTeeth.slice(0, 8).map(t => selectedTeeth.has(t) ? t : "  ").join(" ") + 
                   "  :  " + 
                   upperTeeth.slice(8).map(t => selectedTeeth.has(t) ? t : "  ").join(" ");
  
  const lowerRow = lowerTeeth.slice(0, 8).map(t => selectedTeeth.has(t) ? t : "  ").join(" ") + 
                   "  :  " + 
                   lowerTeeth.slice(8).map(t => selectedTeeth.has(t) ? t : "  ").join(" ");

  return {
    patient_name: patientName,
    date: date,
    scaling: services.scaling,
    filling: services.filling,
    gingival: services.gingival,
    extraction: services.extraction,
    others: services.others,
    other_details: services.others ? otherDetails : "",
    upper_row: upperRow,
    lower_row: lowerRow,
    selected_teeth: Array.from(selectedTeeth).sort()
  };
};

export const downloadJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
