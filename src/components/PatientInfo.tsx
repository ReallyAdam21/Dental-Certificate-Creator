
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const handleNameChange = (value: string) => {
    // Capitalize first letter of each word
    const capitalizedName = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setPatientName(capitalizedName);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Format date as "Month Day, Year" to match the certificate format
      const formattedDate = format(date, 'MMMM d, yyyy');
      setDate(formattedDate);
    }
  };

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
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">Select the treatment date</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
