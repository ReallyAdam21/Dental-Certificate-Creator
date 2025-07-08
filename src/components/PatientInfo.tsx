
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatientInfoProps {
  patientName: string;
  setPatientName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
}

const PatientInfo: React.FC<PatientInfoProps> = ({
  patientName,
  setPatientName,
  date,
  setDate
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-blue-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">1</span>
          </div>
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="patient-name" className="text-sm font-medium text-gray-700">
              Patient Name
            </Label>
            <Input
              id="patient-name"
              type="text"
              placeholder="Enter patient's full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date
            </Label>
            <Input
              id="date"
              type="text"
              placeholder="e.g., July 8, 2025"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Format: Month Day, Year</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
