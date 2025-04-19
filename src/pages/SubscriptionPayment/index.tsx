import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonSpinner,
  useIonToast,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../../utils/supabaseClient';
import './SubscriptionPayment.css';

interface LocationState {
  plan?: {
    type: string;
    price: string;
    interval: string;
  };
}

const SubscriptionPayment: React.FC = () => {
  const [cardHolder, setCardHolder] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [useExistingCard, setUseExistingCard] = useState(true);
  const [present] = useIonToast();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const plan = location.state?.plan || {
    type: 'ENTERPRISE',
    price: '79',
    interval: '/Per month'
  };

  // Use Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    getCustomerId();
  }, []);

  const getCustomerId = async () => {
    try {
      setIsLoading(true);
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user logged in');
      }

      // Get the customer ID and card ID from the payment table
      const { data, error } = await supabase
        .from('payment')
        .select('stripe_customer_id, card_id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data?.stripe_customer_id) {
        setCustomerId(data.stripe_customer_id);

        // If there's a card ID, fetch the card details from Stripe
        if (data.card_id) {
          try {
            // Fetch card details from Stripe API via your backend
            const response = await fetch(`http://localhost:3000/api/payments/customer/${data.stripe_customer_id}/cards/${data.card_id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch card details from Stripe');
            }

            const cardData = await response.json();
            console.log('Card details from Stripe:', cardData);

            if (cardData.card) {
              setCardDetails({
                id: cardData.card.id,
                brand: cardData.card.brand,
                last4: cardData.card.last4,
                exp_month: cardData.card.exp_month,
                exp_year: cardData.card.exp_year,
                name: cardData.card.name || ''
              });

              if (cardData.card.name) {
                setCardHolder(cardData.card.name);
              }
            }
          } catch (cardError) {
            console.error('Error fetching card details from Stripe:', cardError);
            // Continue without card details
          }
        }
      } else {
        throw new Error('No Stripe customer ID found');
      }

    } catch (error) {
      present({
        message: 'Error fetching customer details',
        duration: 3000,
        color: 'danger'
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle card element changes
  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handleSubscribe = async () => {
    if (!customerId) {
      present({
        message: 'Customer ID not found',
        duration: 3000,
        color: 'danger'
      });
      return;
    }

    if (!stripe || !elements) {
      present({
        message: 'Stripe is not initialized',
        duration: 3000,
        color: 'danger'
      });
      return;
    }

    if (!cardHolder.trim()) {
      present({
        message: 'Please enter the card holder name',
        duration: 3000,
        color: 'danger'
      });
      return;
    }

    setIsLoading(true);

    try {
      let paymentMethodId;

      // Check if we should use an existing card
      if (cardDetails && useExistingCard) {
        // Use the existing card ID directly
        paymentMethodId = cardDetails.id;
        console.log('Using existing card:', paymentMethodId);
      } else {
        // Get the card element for a new card
        if (!elements) {
          throw new Error('Stripe Elements is not initialized');
        }

        const cardElement = elements.getElement(CardNumberElement);

        if (!cardElement) {
          throw new Error('Card element not found');
        }

        // Create a payment method with the card element
        const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: cardHolder,
          },
        });

        if (pmError) {
          throw new Error(pmError.message || 'Failed to create payment method');
        }

        paymentMethodId = paymentMethod.id;
      }

      // Create the subscription
      const response = await fetch(`http://localhost:3000/api/payments/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_1R9oIDP8rwhLZO7wKSbWRIEq', // Replace with your actual price IDs
        }),
      });

      const data = await response.json();

      console.log('Subscription response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      present({
        message: 'Subscription created successfully',
        duration: 3000,
        color: 'success'
      });

      // Update user subscription status in your database
      await supabase
        .from('payment')
        .update({
          status: 'subscribed',
          subscription_id: data.id, // Assuming the subscription ID is returned in data.id
          subscription_plan: plan.type
        })
        .eq('stripe_customer_id', customerId);

      history.replace('/main/myscore');

    } catch (error: any) {
      present({
        message: error.message || 'Failed to create subscription',
        duration: 3000,
        color: 'danger'
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/payment" />
          </IonButtons>
          <IonTitle>Payment</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="subscription-container">
          <IonCard className="subscription-card">
            <IonCardHeader className='subscription-card-header'>
              <IonCardTitle>Confirm Your Subscription</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="plan-summary">
                <h2>{plan.type} Plan</h2>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="interval">{plan.interval}</span>
                </div>
              </div>

              <div className="payment-form">
                {cardDetails && (
                  <div className="saved-card-section">
                    <h3>Your Saved Card</h3>
                    <div className="saved-card-info">
                      <div className="card-brand">{cardDetails.brand}</div>
                      <div className="card-number">•••• •••• •••• {cardDetails.last4}</div>
                      <div className="card-expiry">Expires {cardDetails.exp_month}/{cardDetails.exp_year}</div>
                      <div className="card-holder">{cardDetails.name}</div>
                    </div>
                    {/* <IonItem lines="none" className="toggle-item">
                      <IonLabel>Use this card</IonLabel>
                      <IonCheckbox
                        checked={useExistingCard}
                        onIonChange={e => setUseExistingCard(e.detail.checked)}
                        slot="start"
                      />
                    </IonItem> */}
                  </div>
                )}

                {(!cardDetails || !useExistingCard) && (
                  <>
                    <IonItem lines="none" className="form-item">
                      <IonLabel position="floating">Card Holder Name</IonLabel>
                      <IonInput
                        value={cardHolder}
                        onIonChange={e => setCardHolder(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <div className="stripe-element-container">
                      <label>Card Number</label>
                      <CardNumberElement
                        className="stripe-element"
                        onChange={handleCardChange}
                        options={{
                          showIcon: true,
                          iconStyle: 'solid',
                        }}
                      />
                    </div>

                    <div className="card-row">
                      <div className="stripe-element-container">
                        <label>Expiration Date</label>
                        <CardExpiryElement
                          className="stripe-element"
                          onChange={handleCardChange}
                        />
                      </div>
                      <div className="stripe-element-container">
                        <label>CVC</label>
                        <CardCvcElement
                          className="stripe-element"
                          onChange={handleCardChange}
                        />
                      </div>
                    </div>

                    {cardError && (
                      <div className="card-error">
                        {cardError}
                      </div>
                    )}
                  </>
                )}

                <IonItem lines="none" className="checkbox-item">
                  <IonCheckbox
                    checked={saveCard}
                    onIonChange={e => setSaveCard(e.detail.checked)}
                    slot="start"
                  />
                  <IonLabel>Save card for future payments</IonLabel>
                </IonItem>
              </div>

              <div className="subscription-terms">
                <p>
                  By subscribing, you agree to our Terms of Service and authorize us to charge your card on a recurring basis. You can cancel anytime.
                </p>
              </div>

              <IonButton
                expand="block"
                className="subscribe-button"
                onClick={handleSubscribe}
                disabled={isLoading || !!cardError}
              >
                {isLoading ? <IonSpinner name="dots" /> : `Subscribe for $${plan.price}${plan.interval}`}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SubscriptionPayment;


