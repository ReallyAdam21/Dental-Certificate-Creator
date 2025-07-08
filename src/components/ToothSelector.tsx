
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ToothSelectorProps {
  selectedTeeth: Set<string>;
  setSelectedTeeth: (teeth: Set<string>) => void;
}

const ToothSelector: React.FC<ToothSelectorProps> = ({
  selectedTeeth,
  setSelectedTeeth
}) => {
  const upperTeeth = ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"];
  const lowerTeeth = ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"];

  const toggleTooth = (tooth: string) => {
    const newSelected = new Set(selectedTeeth);
    if (newSelected.has(tooth)) {
      newSelected.delete(tooth);
    } else {
      newSelected.add(tooth);
    }
    setSelectedTeeth(newSelected);
  };

  const clearSelection = () => {
    setSelectedTeeth(new Set());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">3</span>
          </div>
          Tooth Selection for Filling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Click on teeth to select/deselect</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSelection}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-100">
          {/* Upper Teeth */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3 text-center">Upper Teeth</div>
            <div className="grid grid-cols-8 gap-1 sm:gap-2 justify-center max-w-2xl mx-auto">
              {upperTeeth.slice(0, 8).map((tooth) => (
                <Button
                  key={tooth}
                  variant={selectedTeeth.has(tooth) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTooth(tooth)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xs font-bold transition-all duration-200 ${
                    selectedTeeth.has(tooth) 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-md transform scale-105' 
                      : 'hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  {tooth}
                </Button>
              ))}
            </div>
            <div className="text-center my-2 text-gray-400 text-sm">|</div>
            <div className="grid grid-cols-8 gap-1 sm:gap-2 justify-center max-w-2xl mx-auto">
              {upperTeeth.slice(8).map((tooth) => (
                <Button
                  key={tooth}
                  variant={selectedTeeth.has(tooth) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTooth(tooth)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xs font-bold transition-all duration-200 ${
                    selectedTeeth.has(tooth) 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-md transform scale-105' 
                      : 'hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  {tooth}
                </Button>
              ))}
            </div>
          </div>

          {/* Lower Teeth */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3 text-center">Lower Teeth</div>
            <div className="grid grid-cols-8 gap-1 sm:gap-2 justify-center max-w-2xl mx-auto">
              {lowerTeeth.slice(0, 8).map((tooth) => (
                <Button
                  key={tooth}
                  variant={selectedTeeth.has(tooth) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTooth(tooth)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xs font-bold transition-all duration-200 ${
                    selectedTeeth.has(tooth) 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-md transform scale-105' 
                      : 'hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  {tooth}
                </Button>
              ))}
            </div>
            <div className="text-center my-2 text-gray-400 text-sm">|</div>
            <div className="grid grid-cols-8 gap-1 sm:gap-2 justify-center max-w-2xl mx-auto">
              {lowerTeeth.slice(8).map((tooth) => (
                <Button
                  key={tooth}
                  variant={selectedTeeth.has(tooth) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTooth(tooth)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xs font-bold transition-all duration-200 ${
                    selectedTeeth.has(tooth) 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-md transform scale-105' 
                      : 'hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  {tooth}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {selectedTeeth.size > 0 && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">
              Selected teeth: {Array.from(selectedTeeth).sort().join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToothSelector;
