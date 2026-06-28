-- Scope: only fixes the public Family Buggy Fuerteventura partner row.
UPDATE partners
SET
  business_type = 'Buggy Adventure',
  activity_type = 'buggy-adventure',
  updated_at = NOW()
WHERE slug = 'family-buggy-fuerteventura';
