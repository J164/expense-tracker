CREATE OR REPLACE FUNCTION update_monthly_summary()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO Monthly_Summary (user_id, month, total_spent, budget)
        VALUES (
            NEW.user_id, 
            DATE_TRUNC('month', NEW.purchase_date), 
            NEW.amount, 
            (SELECT default_budget FROM Users WHERE id = NEW.user_id)
        )
        ON CONFLICT (user_id, month) DO UPDATE 
        SET total_spent = Monthly_Summary.total_spent + NEW.amount;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        UPDATE Monthly_Summary
        SET 
            total_spent = total_spent + NEW.amount - OLD.amount
        WHERE user_id = NEW.user_id
          AND DATE_TRUNC('month', month) = DATE_TRUNC('month', NEW.purchase_date);
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE Monthly_Summary
        SET 
            total_spent = total_spent - OLD.amount
        WHERE user_id = OLD.user_id
          AND DATE_TRUNC('month', month) = DATE_TRUNC('month', OLD.purchase_date);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_monthly_summary
AFTER INSERT OR UPDATE OR DELETE ON Transactions
FOR EACH ROW
EXECUTE FUNCTION update_monthly_summary();

