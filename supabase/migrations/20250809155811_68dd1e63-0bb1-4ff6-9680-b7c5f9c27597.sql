-- Create a function to search patients by concatenated first_name and last_name
CREATE OR REPLACE FUNCTION search_patients(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  phone TEXT,
  email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    (p.first_name || ' ' || p.last_name) as name,
    p.title,
    p.phone,
    p.email
  FROM patients p
  WHERE 
    p.first_name ILIKE '%' || search_term || '%' OR
    p.last_name ILIKE '%' || search_term || '%'
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;