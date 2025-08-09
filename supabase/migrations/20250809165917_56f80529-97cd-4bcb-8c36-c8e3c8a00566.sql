-- Revert patients table RLS policies to require authentication
DROP POLICY IF EXISTS "Allow public access to patients for development" ON public.patients;

-- Create proper authenticated user policies
CREATE POLICY "Authenticated users can access all patients" 
ON public.patients 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);