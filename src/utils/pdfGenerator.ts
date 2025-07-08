
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
