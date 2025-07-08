
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Stethoscope } from 'lucide-react';
import PatientInfo from '@/components/PatientInfo';
import ServiceSelection from '@/components/ServiceSelection';
import ToothSelector from '@/components/ToothSelector';
import { validateForm } from '@/utils/validation';
import { generateCertificateData, downloadJSON } from '@/utils/pdfGenerator';

const Index = () => {
  const { toast } = useToast();
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [services, setServices] = useState({
    scaling: false,
    filling: false,
    gingival: false,
    extraction: false,
    others: false,
  });
  const [otherDetails, setOtherDetails] = useState('');
  const [selectedTeeth, setSelectedTeeth] = useState<Set<string>>(new Set());

  const handleGenerateCertificate = () => {
    const validation = validateForm(patientName, date, services, selectedTeeth);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      const certificateData = generateCertificateData(
        patientName,
        date,
        services,
        otherDetails,
        selectedTeeth
      );
      
      const filename = `${patientName.replace(/\s+/g, '_')}_Dental_Certificate.json`;
      downloadJSON(certificateData, filename);
      
      toast({
        title: "Success!",
        description: "Certificate data has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                Dental Certificate Generator
              </h1>
              <p className="text-blue-600 text-sm sm:text-base">
                Create professional dental certificates with ease
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Patient Information */}
          <div className="animate-in slide-in-from-left duration-500">
            <PatientInfo
              patientName={patientName}
              setPatientName={setPatientName}
              date={date}
              setDate={setDate}
            />
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="animate-in slide-in-from-left duration-500 delay-150">
              <ServiceSelection
                services={services}
                setServices={setServices}
                otherDetails={otherDetails}
                setOtherDetails={setOtherDetails}
              />
            </div>

            <div className="animate-in slide-in-from-right duration-500 delay-300">
              <ToothSelector
                selectedTeeth={selectedTeeth}
                setSelectedTeeth={setSelectedTeeth}
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center animate-in slide-in-from-bottom duration-500 delay-500">
            <Button
              onClick={handleGenerateCertificate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FileText className="w-5 h-5 mr-2" />
              Generate Certificate
              <Download className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-in fade-in duration-500 delay-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900">How it works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fill in patient information and select services provided</li>
                  <li>• For tooth filling, click on the specific teeth to select them</li>
                  <li>• Click "Generate Certificate" to download the certificate data</li>
                  <li>• The data can be used with your PDF generation system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
