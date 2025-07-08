
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ServiceSelectionProps {
  services: {
    scaling: boolean;
    filling: boolean;
    gingival: boolean;
    extraction: boolean;
    others: boolean;
  };
  setServices: (services: any) => void;
  otherDetails: string;
  setOtherDetails: (details: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  setServices,
  otherDetails,
  setOtherDetails
}) => {
  const serviceOptions = [
    { key: 'scaling', label: 'Thorough scaling and polishing' },
    { key: 'filling', label: 'Tooth filling' },
    { key: 'gingival', label: 'Gingival / Periodontal Treatment' },
    { key: 'extraction', label: 'Tooth Extraction' },
  ];

  const handleServiceChange = (key: string, checked: boolean) => {
    setServices({ ...services, [key]: checked });
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-blue-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">2</span>
          </div>
          Services Provided
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {serviceOptions.map((option) => (
            <div key={option.key} className="flex items-center space-x-3">
              <Checkbox
                id={option.key}
                checked={services[option.key as keyof typeof services]}
                onCheckedChange={(checked) => handleServiceChange(option.key, checked as boolean)}
              />
              <Label 
                htmlFor={option.key} 
                className="text-sm font-medium text-gray-700 cursor-pointer leading-relaxed"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="others"
              checked={services.others}
              onCheckedChange={(checked) => handleServiceChange('others', checked as boolean)}
            />
            <Label htmlFor="others" className="text-sm font-medium text-gray-700 cursor-pointer">
              Others:
            </Label>
          </div>
          {services.others && (
            <div className="ml-6">
              <Input
                type="text"
                placeholder="Specify other services..."
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
