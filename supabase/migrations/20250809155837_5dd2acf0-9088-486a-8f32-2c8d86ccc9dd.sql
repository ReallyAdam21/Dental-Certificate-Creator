-- Fix the search path security issue for the search_patients function
DROP FUNCTION IF EXISTS search_patients(TEXT);

CREATE OR REPLACE FUNCTION search_patients(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  phone TEXT,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    (p.first_name || ' ' || p.last_name) as name,
    p.title,
    p.phone,
    p.email
  FROM public.patients p
  WHERE 
    p.first_name ILIKE '%' || search_term || '%' OR
    p.last_name ILIKE '%' || search_term || '%'
  LIMIT 10;
END;
$$;