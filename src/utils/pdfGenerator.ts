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
  selectedTeeth: Set<string>,
  title: string = 'Mr.'
) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Set font
  pdf.setFont('times', 'normal');
  
  // Header - Clinic Name
  pdf.setFontSize(18);
  pdf.setFont('times', 'bold');
  pdf.text('TANGLAO DENTAL CLINIC', 105, 20, { align: 'center' });
  
  // Clinic Info
  pdf.setFontSize(12);
  pdf.setFont('times', 'normal');
  pdf.text('MacArthur Hi-Way, Sto. Domingo I, Capas, Tarlac', 105, 28, { align: 'center' });
  pdf.text('Tel. No.: 045-493-3454 | Cell No.: 0928-9950-488', 105, 34, { align: 'center' });
  
  // Title
  pdf.setFontSize(16);
  pdf.setFont('times', 'bold');
  pdf.text('CERTIFICATE OF DENTAL TREATMENT', 105, 45, { align: 'center' });
  
  // Add underline for title
  pdf.line(40, 47, 170, 47);
  
  // Date - Remove bold, keep normal font
  pdf.setFontSize(14);
  pdf.setFont('times', 'bold');
  pdf.text('Date:', 20, 60);
  pdf.setFont('times', 'normal');
  pdf.text(date, 42, 60);
  
  // Body text
  pdf.setFontSize(13);
  pdf.setFont('times', 'normal');
  pdf.text('To Whom It May Concern:', 20, 75);
  
  // Updated patient name with title and better spacing
  const bodyText1 = `This is to certify that ${title} `;
  pdf.text(bodyText1, 20, 85);
  
  // Make patient name bold and italic with extra spacing
  const nameStartX = 20 + pdf.getTextWidth(bodyText1);
  pdf.setFont('times', 'bolditalic');
  pdf.text(patientName, nameStartX, 85);
  
  // Add extra space after name before continuing text
  const nameEndX = nameStartX + pdf.getTextWidth(patientName) + 5; // +5 for extra space
  pdf.setFont('times', 'normal');
  pdf.text('has undergone dental treatment and', nameEndX, 85);
  pdf.text('received the following services:', 20, 95);
  
  // Services with checkboxes - larger font and better spacing
  let yPos = 105;
  
  // Helper function to draw checkbox
  const drawCheckbox = (x: number, y: number, checked: boolean) => {
    // Draw square border
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.rect(x, y - 3, 4, 4);
    if (checked) {
      // Draw checkmark as lines instead of unicode character
      pdf.setLineWidth(1);
      pdf.line(x + 0.5, y - 1, x + 1.5, y + 0.5);
      pdf.line(x + 1.5, y + 0.5, x + 3.5, y - 2.5);
    }
  };
  
  // Set service text font size
  pdf.setFontSize(13);
  
  // Thorough scaling and polishing
  drawCheckbox(20, yPos, services.scaling);
  pdf.setFont('times', 'normal');
  pdf.text('Thorough scaling and polishing', 28, yPos);
  yPos += 10;
  
  // Tooth filling
  drawCheckbox(20, yPos, services.filling);
  pdf.text('Tooth filling as indicated below:', 28, yPos);
  yPos += 12;
  
  // Tooth grid - Always show (as requested)
  if (true) { // Always show tooth grid
    pdf.setFontSize(11); // Slightly larger tooth numbers
    pdf.setFont('times', 'normal');
    
    // Upper teeth: 18-11 : 21-28
    const upperLeft = ["18", "17", "16", "15", "14", "13", "12", "11"];
    const upperRight = ["21", "22", "23", "24", "25", "26", "27", "28"];
    
    // Lower teeth: 48-41 : 31-38  
    const lowerLeft = ["48", "47", "46", "45", "44", "43", "42", "41"];
    const lowerRight = ["31", "32", "33", "34", "35", "36", "37", "38"];
    
    // Draw upper teeth row
    let startX = 20; // Move further left to fit all teeth
    let currentX = startX;
    const toothSpacing = 8; // Reduce spacing to fit all teeth
    
    // Upper left teeth (18-11)
    upperLeft.forEach(tooth => {
      if (selectedTeeth.has(tooth)) {
        pdf.setFillColor(200, 255, 200); // Light green background
        pdf.rect(currentX - 1, yPos - 3, 10, 6, 'F');
        pdf.setFont('times', 'bold');
      } else {
        pdf.setFont('times', 'normal');
      }
      pdf.text(tooth, currentX + 4, yPos, { align: 'center' });
      currentX += toothSpacing;
    });
    
    // Colon separator
    pdf.setFont('times', 'normal');
    pdf.text(':', currentX + 2, yPos);
    currentX += 8; // Smaller gap for colon
    
    // Upper right teeth (21-28)
    upperRight.forEach(tooth => {
      if (selectedTeeth.has(tooth)) {
        pdf.setFillColor(200, 255, 200); // Light green background
        pdf.rect(currentX - 1, yPos - 3, 10, 6, 'F');
        pdf.setFont('times', 'bold');
      } else {
        pdf.setFont('times', 'normal');
      }
      pdf.text(tooth, currentX + 4, yPos, { align: 'center' });
      currentX += toothSpacing;
    });
    
    yPos += 12;
    
    // Draw lower teeth row
    currentX = startX;
    
    // Lower left teeth (48-41)
    lowerLeft.forEach(tooth => {
      if (selectedTeeth.has(tooth)) {
        pdf.setFillColor(200, 255, 200); // Light green background
        pdf.rect(currentX - 1, yPos - 3, 10, 6, 'F');
        pdf.setFont('times', 'bold');
      } else {
        pdf.setFont('times', 'normal');
      }
      pdf.text(tooth, currentX + 4, yPos, { align: 'center' });
      currentX += toothSpacing;
    });
    
    // Colon separator
    pdf.setFont('times', 'normal');
    pdf.text(':', currentX + 2, yPos);
    currentX += 8; // Smaller gap for colon
    
    // Lower right teeth (31-38)
    lowerRight.forEach(tooth => {
      if (selectedTeeth.has(tooth)) {
        pdf.setFillColor(200, 255, 200); // Light green background
        pdf.rect(currentX - 1, yPos - 3, 10, 6, 'F');
        pdf.setFont('times', 'bold');
      } else {
        pdf.setFont('times', 'normal');
      }
      pdf.text(tooth, currentX + 4, yPos, { align: 'center' });
      currentX += toothSpacing;
    });
    
    yPos += 20;
  } else {
    // Add some spacing even if no tooth grid
    yPos += 5;
  }
  
  // Reset font and continue with services
  pdf.setFontSize(13);
  pdf.setFont('times', 'normal');
  
  // Gingival / Periodontal Treatment
  drawCheckbox(20, yPos, services.gingival);
  pdf.text('Gingival / Periodontal Treatment', 28, yPos);
  yPos += 10;
  
  // Tooth Extraction
  drawCheckbox(20, yPos, services.extraction);
  pdf.text('Tooth Extraction', 28, yPos);
  yPos += 10;
  
  // Others - make inputted text bold and italic
  drawCheckbox(20, yPos, services.others);
  pdf.text('Others:', 28, yPos);
  if (services.others && otherDetails) {
    const othersWidth = pdf.getTextWidth('Others: ');
    pdf.setFont('times', 'bolditalic');
    pdf.text(otherDetails, 28 + othersWidth, yPos);
  }
  yPos += 20;
  
  // Closing text
  const closingText = 'This certification is issued upon the request of the above-named patient for whatever purpose it may serve.';
  const splitClosing = pdf.splitTextToSize(closingText, 170);
  pdf.text(splitClosing, 20, yPos);
  
  // Signatures
  const signatureY = 240;
  
  // Signature lines
  pdf.line(40, signatureY, 90, signatureY);
  pdf.line(120, signatureY, 170, signatureY);
  
  // Doctor names
  pdf.setFontSize(10);
  pdf.text('Dr. Naomi Tanglao-Cortez', 65, signatureY + 8, { align: 'center' });
  pdf.text('Dr. Adonis E. Cortez', 145, signatureY + 8, { align: 'center' });
  
  // PRC numbers
  pdf.text('PRC # 40879', 65, signatureY + 15, { align: 'center' });
  pdf.text('PRC # 37378', 145, signatureY + 15, { align: 'center' });
  
  // Download the PDF
  const filename = `${patientName.replace(/\s+/g, '_')}_Dental_Certificate.pdf`;
  pdf.save(filename);
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
