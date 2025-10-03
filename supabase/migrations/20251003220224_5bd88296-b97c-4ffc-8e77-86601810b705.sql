-- Enable realtime for transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Add notification trigger for transaction status updates
CREATE OR REPLACE FUNCTION notify_transaction_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'completed' THEN 
          CASE 
            WHEN NEW.type = 'deposit' THEN 'Deposit Approved'
            WHEN NEW.type = 'withdrawal' THEN 'Withdrawal Approved'
          END
        WHEN NEW.status = 'failed' THEN
          CASE 
            WHEN NEW.type = 'deposit' THEN 'Deposit Rejected'
            WHEN NEW.type = 'withdrawal' THEN 'Withdrawal Rejected'
          END
      END,
      CASE 
        WHEN NEW.status = 'completed' THEN 
          'Your ' || NEW.type || ' of $' || NEW.amount || ' has been approved and processed.'
        WHEN NEW.status = 'failed' THEN
          'Your ' || NEW.type || ' of $' || NEW.amount || ' has been rejected.'
      END,
      CASE 
        WHEN NEW.status = 'completed' THEN 'success'
        WHEN NEW.status = 'failed' THEN 'error'
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER transaction_status_notification
AFTER UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION notify_transaction_status_change();