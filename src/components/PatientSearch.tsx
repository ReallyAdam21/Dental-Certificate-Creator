import React, { useState, useEffect } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  age?: number;
  address?: string;
}

interface PatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
  onNewPatient: () => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onPatientSelect, onNewPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchPatients = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, first_name, last_name, phone, email, date_of_birth, age, address')
          .or(`name.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) throw error;

        setSearchResults((data as unknown as Patient[]) || []);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search patients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, toast]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search existing patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {searchResults.length > 0 && (
        <Card className="max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {searchResults.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      {patient.email && <p>{patient.email}</p>}
                      {patient.phone && <p>{patient.phone}</p>}
                      {patient.date_of_birth && <p>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-3">No patients found matching "{searchQuery}"</p>
          <Button onClick={onNewPatient} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add as New Patient
          </Button>
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-4">
          <Button onClick={onNewPatient} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Patient
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;