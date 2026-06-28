CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS sales_demos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  magazine_id text NOT NULL,
  expires_at timestamptz NOT NULL,
  view_count integer NOT NULL DEFAULT 0,
  whatsapp_clicks integer NOT NULL DEFAULT 0,
  signup_clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sales_demos_token_idx ON sales_demos (token);
CREATE INDEX IF NOT EXISTS sales_demos_lead_id_idx ON sales_demos (lead_id);
CREATE INDEX IF NOT EXISTS sales_demos_expires_at_idx ON sales_demos (expires_at);

ALTER TABLE sales_demos ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION increment_sales_demo_stat(p_token text, p_field text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_field = 'view_count' THEN
    UPDATE sales_demos
      SET view_count = view_count + 1
      WHERE token = p_token AND expires_at > now();
  ELSIF p_field = 'whatsapp_clicks' THEN
    UPDATE sales_demos
      SET whatsapp_clicks = whatsapp_clicks + 1
      WHERE token = p_token AND expires_at > now();
  ELSIF p_field = 'signup_clicks' THEN
    UPDATE sales_demos
      SET signup_clicks = signup_clicks + 1
      WHERE token = p_token AND expires_at > now();
  END IF;
END;
$$;

NOTIFY pgrst, 'reload schema';
