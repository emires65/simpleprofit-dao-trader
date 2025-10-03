-- Update foreign key: link transactions.user_id to profiles.id instead of auth.users
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;

ALTER TABLE public.transactions
ADD CONSTRAINT transactions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;