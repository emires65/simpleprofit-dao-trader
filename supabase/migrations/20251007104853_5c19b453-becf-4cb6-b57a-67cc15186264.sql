-- Ensure full row data is sent in realtime updates for profiles
ALTER TABLE public.profiles REPLICA IDENTITY FULL;