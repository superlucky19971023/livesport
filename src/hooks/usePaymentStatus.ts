import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export const usePaymentStatus = () => {
  const [isChecking, setIsChecking] = useState(true);
  const history = useHistory();

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        history.push('/signin');
        return;
      }

      // Check payment status
      const { data: paymentData, error } = await supabase
        .from('payment')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        history.push('/payment');
        return;
      }

      // Redirect based on status
      if (paymentData?.status !== 'subscribed') {
        history.push('/payment');
      }

    } catch (error) {
      console.error('Error:', error);
      history.push('/payment');
    } finally {
      setIsChecking(false);
    }
  };

  return { isChecking };
};