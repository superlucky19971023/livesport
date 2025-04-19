import { supabase } from "../utils/supabaseClient";

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    // Step 1: Sign up user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase signup error:", error);
      throw error;
    }

    if (!data?.user) {
      console.error("No user data returned from signup");
      throw new Error('User creation failed');
    }

    const user_id = data.user.id;
    console.log("Created user with ID:", user_id);

    // Step 2: Create Stripe customer
    try {
      const stripeResponse = await fetch('http://localhost:3000/api/payments/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: fullName,
        }),
      });

      const stripeData = await stripeResponse.json();
      console.log("Stripe customer creation response:", stripeData);

      if (!stripeResponse.ok) {
        throw new Error(`Failed to create Stripe customer: ${stripeData.error || 'Unknown error'}`);
      }

      // Step 3: Save to payment table
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment')
        .insert([
          {
            user_id: user_id,
            stripe_customer_id: stripeData.id,
            status: 'customer_created'
          }
        ])
        .select()
        .single();

      if (paymentError) {
        console.error("Payment table insertion error:", paymentError);
        throw paymentError;
      }

      console.log("Successfully saved payment record:", paymentData);
      return { success: true, user: data.user };

    } catch (stripeError) {
      // If Stripe or payment table insertion fails, clean up the created user
      console.error("Error in Stripe process:", stripeError);
      await supabase.auth.signOut();
      throw stripeError;
    }

  } catch (error: any) {
    console.error("Signup process error:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};


