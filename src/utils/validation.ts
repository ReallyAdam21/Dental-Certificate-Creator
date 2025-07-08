
export const validateDate = (date: string): boolean => {
  const pattern = /^[A-Za-z]+\s\d{1,2},\s\d{4}$/;
  return pattern.test(date);
};

export const validateForm = (
  patientName: string,
  date: string,
  services: any,
  selectedTeeth: Set<string>
): { isValid: boolean; error?: string } => {
  if (!patientName.trim()) {
    return { isValid: false, error: 'Please fill in Patient Name.' };
  }

  if (!date.trim()) {
    return { isValid: false, error: 'Please fill in Date.' };
  }

  if (!validateDate(date)) {
    return { isValid: false, error: 'Please enter a valid date (e.g., July 8, 2025).' };
  }

  if (services.filling && selectedTeeth.size === 0) {
    return { isValid: false, error: 'Please select teeth for filling.' };
  }

  return { isValid: true };
};
