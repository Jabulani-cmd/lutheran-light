
-- Create committees table
CREATE TABLE public.committees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view committees" ON public.committees FOR SELECT USING (true);
CREATE POLICY "Admins can insert committees" ON public.committees FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update committees" ON public.committees FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete committees" ON public.committees FOR DELETE USING (is_admin());

-- Create committee_members table
CREATE TABLE public.committee_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id uuid REFERENCES public.committees(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  title text,
  description text,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view committee members" ON public.committee_members FOR SELECT USING (true);
CREATE POLICY "Admins can insert committee members" ON public.committee_members FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update committee members" ON public.committee_members FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete committee members" ON public.committee_members FOR DELETE USING (is_admin());

-- Create storage bucket for committee member photos
INSERT INTO storage.buckets (id, name, public) VALUES ('committee-photos', 'committee-photos', true);

CREATE POLICY "Anyone can view committee photos" ON storage.objects FOR SELECT USING (bucket_id = 'committee-photos');
CREATE POLICY "Admins can upload committee photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'committee-photos' AND (SELECT is_admin()));
CREATE POLICY "Admins can update committee photos" ON storage.objects FOR UPDATE USING (bucket_id = 'committee-photos' AND (SELECT is_admin()));
CREATE POLICY "Admins can delete committee photos" ON storage.objects FOR DELETE USING (bucket_id = 'committee-photos' AND (SELECT is_admin()));
