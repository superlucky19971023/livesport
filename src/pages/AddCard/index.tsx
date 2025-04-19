import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonInput,
  IonButton,
  IonCheckbox,
  IonLabel,
  useIonToast,
  IonSpinner,
} from '@ionic/react';
import './AddCard.css';
import { supabase } from '../../utils/supabaseClient';
import { useHistory } from 'react-router-dom';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const AddCard: React.FC = () => {
  const [cardHolder, setCardHolder] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [present] = useIonToast();
  const history = useHistory();

  // Use Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    getCustomerId();
  }, []);

  const getCustomerId = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user logged in');
      }

      // Get the customer ID from the payment table
      const { data, error } = await supabase
        .from('payment')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      console.log(data);

      if (error) throw error;

      if (data?.stripe_customer_id) {
        setCustomerId(data.stripe_customer_id);
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

  const handleAddCard = async () => {
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
      // Get the card element
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create a token with the card element
      const { token, error } = await stripe.createToken(cardElement, {
        name: cardHolder
      });

      if (error) {
        throw new Error(error.message || 'Failed to create token');
      }

      // Send token to your backend
      const response = await fetch(`http://localhost:3000/api/payments/customer/${customerId}/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          cardToken: token.id
        }),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add card');
      }

      present({
        message: 'Card added successfully',
        duration: 3000,
        color: 'success'
      });

      // Get the card ID from the response
      const cardId = data.id || data.card?.id;

      if (!cardId) {
        console.error('No card ID found in response:', data);
      } else {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('No user logged in');
        }

        // Update the payment table with the card ID
        const { error: updateError } = await supabase
          .from('payment')
          .update({ card_id: cardId })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating payment table with card ID:', updateError);
          // Continue anyway since the card was added to Stripe successfully
        } else {
          console.log('Successfully saved card ID to payment table');
        }
      }

      history.replace('/payment');

    } catch (error: any) {
      present({
        message: error.message || 'Failed to add card',
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
          <IonTitle>Add Card</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="add-card-container">
          {/* Card Preview */}
          <div className="card-preview">
            <div className="card-type">CARD/BANK</div>
            <div className="card-number">
              •••• •••• •••• ••••
            </div>
            <div className="card-footer">
              <div className="card-holder">
                <div className="label">CARD HOLDER</div>
                <div className="value">{cardHolder || 'Card Holder'}</div>
              </div>
              <div className="card-chip">
                <div className="chip-icon"></div>
                <div className="cvc-text">CVC</div>
              </div>
            </div>
          </div>

          {/* Card Details Form */}
          <div className="card-details">
            <h2>Card Details</h2>

            <div className="input-group">
              <IonInput
                label="Card Holder Name"
                labelPlacement="floating"
                fill="solid"
                className="custom-input-details"
                value={cardHolder}
                style = {{color:'#666666'}}
                onIonInput={e => setCardHolder(e.detail.value!)}
                required
              />
            </div>

            <div className="input-group">
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
            </div>

            <div className="input-row">
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

            <div className="checkbox-container">
              <IonCheckbox
                checked={saveCard}
                onIonChange={e => setSaveCard(e.detail.checked)}
              />
              <IonLabel>Save Card for Later</IonLabel>
            </div>

            <IonButton
              expand="block"
              className="add-card-button"
              onClick={handleAddCard}
              disabled={isLoading || !!cardError}
            >
              {isLoading ? <IonSpinner name="dots" /> : 'ADD CARD'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddCard;
