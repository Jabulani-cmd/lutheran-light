-- Add poster image and programme document columns to events table
ALTER TABLE public.events ADD COLUMN poster_image_url text;
ALTER TABLE public.events ADD COLUMN programme_document_url text;

-- Create storage bucket for event posters
INSERT INTO storage.buckets (id, name, public) VALUES ('event-posters', 'event-posters', true);

-- Create storage bucket for event programme documents
INSERT INTO storage.buckets (id, name, public) VALUES ('event-programmes', 'event-programmes', true);

-- RLS for event-posters bucket
CREATE POLICY "Anyone can view event posters" ON storage.objects FOR SELECT USING (bucket_id = 'event-posters');
CREATE POLICY "Admins can upload event posters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-posters' AND public.is_admin());
CREATE POLICY "Admins can update event posters" ON storage.objects FOR UPDATE USING (bucket_id = 'event-posters' AND public.is_admin());
CREATE POLICY "Admins can delete event posters" ON storage.objects FOR DELETE USING (bucket_id = 'event-posters' AND public.is_admin());

-- RLS for event-programmes bucket
CREATE POLICY "Anyone can view event programmes" ON storage.objects FOR SELECT USING (bucket_id = 'event-programmes');
CREATE POLICY "Admins can upload event programmes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-programmes' AND public.is_admin());
CREATE POLICY "Admins can update event programmes" ON storage.objects FOR UPDATE USING (bucket_id = 'event-programmes' AND public.is_admin());
CREATE POLICY "Admins can delete event programmes" ON storage.objects FOR DELETE USING (bucket_id = 'event-programmes' AND public.is_admin());