CREATE TABLE public.reservation_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  selected_package TEXT NOT NULL,
  additional_representatives INTEGER NOT NULL DEFAULT 0 CHECK (additional_representatives BETWEEN 0 AND 10),
  message TEXT,
  quoted_net_total INTEGER NOT NULL CHECK (quoted_net_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.reservation_inquiries TO anon, authenticated;
GRANT ALL ON public.reservation_inquiries TO service_role;

ALTER TABLE public.reservation_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit reservation inquiries"
ON public.reservation_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND length(trim(company)) BETWEEN 1 AND 160
  AND length(trim(email)) BETWEEN 3 AND 254
  AND selected_package IN ('premium', 'twoThirds', 'oneThird', 'wall')
  AND additional_representatives BETWEEN 0 AND 10
  AND quoted_net_total >= 950
);