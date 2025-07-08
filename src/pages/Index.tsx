
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Stethoscope } from 'lucide-react';
import PatientInfo from '@/components/PatientInfo';
import ServiceSelection from '@/components/ServiceSelection';
import ToothSelector from '@/components/ToothSelector';
import { validateForm } from '@/utils/validation';
import { generateCertificatePDF } from '@/utils/pdfGenerator';

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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCertificate = async () => {
    const validation = validateForm(patientName, date, services, selectedTeeth);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generateCertificatePDF(
        patientName,
        date,
        services,
        otherDetails,
        selectedTeeth
      );
      
      toast({
        title: "Success!",
        description: "Certificate PDF has been generated and downloaded.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-900">
                Dental Certificate Generator
              </h1>
              <p className="text-blue-600 text-sm md:text-base">
                Create professional dental certificates with ease
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Patient Information - Full Width */}
          <div className="animate-in slide-in-from-left duration-500">
            <PatientInfo
              patientName={patientName}
              setPatientName={setPatientName}
              date={date}
              setDate={setDate}
            />
          </div>

          {/* Services and Tooth Selection Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
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
              disabled={isGenerating}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              {isGenerating ? 'Generating PDF...' : 'Generate PDF Certificate'}
              <Download className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 animate-in fade-in duration-500 delay-700">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-blue-900">How it works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fill in patient information and select services provided</li>
                  <li>• For tooth filling, click on the specific teeth to select them</li>
                  <li>• Click "Generate PDF Certificate" to create and download the PDF</li>
                  <li>• The PDF will match the official dental certificate format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
