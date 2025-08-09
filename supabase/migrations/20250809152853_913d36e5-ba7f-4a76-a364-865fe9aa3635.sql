-- Create patients table for storing patient information
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for patient access (assuming public access for now, can be restricted later)
CREATE POLICY "Anyone can view patients" 
ON public.patients 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update patients" 
ON public.patients 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete patients" 
ON public.patients 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster name searches
CREATE INDEX idx_patients_name ON public.patients USING btree(name);
CREATE INDEX idx_patients_name_text_search ON public.patients USING gin(to_tsvector('english', name));