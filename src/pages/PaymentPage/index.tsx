import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonLoading,
  useIonToast,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { supabase } from '../../utils/supabaseClient';
import './PaymentPage.css';

const plans = [
  {
    type: 'FREE',
    description: 'Essentials tools for individuals and talents',
    price: '0',
    interval: '',
    features: [
      { name: 'Dashboard Access', enabled: true },
      { name: 'Customer Support', enabled: true },
      { name: 'Unlimited Campaigns', enabled: false },
      { name: 'Unlimited Influencers', enabled: false },
      { name: 'Fraud Prevention', enabled: false },
      { name: 'AI Processing', enabled: false },
    ]
  },
  {
    type: 'ENTERPRISE',
    description: 'Essentials tools for individuals and talents',
    price: '79',
    interval: '/Per month',
    features: [
      { name: 'Dashboard Access', enabled: true },
      { name: 'Customer Support', enabled: true },
      { name: 'Unlimited Campaigns', enabled: true },
      { name: 'Unlimited Influencers', enabled: true },
      { name: 'Fraud Prevention', enabled: true },
      { name: 'AI Processing', enabled: true },
    ]
  }
];

const PaymentPage: React.FC = () => {
  const [hasCard, setHasCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    checkUserCard();
  }, []);

  const checkUserCard = async () => {
    try {
      setLoading(true);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user logged in');
      }

      // Get the payment record for the user
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment')
        .select('card_id')
        .eq('user_id', user.id)
        .single();

      if (paymentError) {
        console.error('Error fetching payment data:', paymentError);
        return;
      }

      // Check if the user has a card_id
      setHasCard(!!paymentData?.card_id);
      console.log('User has card:', !!paymentData?.card_id);

    } catch (error: any) {
      console.error('Error checking user card:', error);
      // Don't show error toast as this is a background check
    } finally {
      setLoading(false);
    }
  };

  const routePayment = (plan: any) => {
    if (plan.type === 'FREE') {
      console.log("Free");
      history.push("main/myscore");
    } else {
      console.log("Enterprise");

      if (hasCard) {
        // If user has a card, go directly to subscription page
        history.push({
          pathname: "/subscribe",
          state: { plan }
        });
      } else {
        // If user doesn't have a card, go to add card page first
        history.push({
          pathname: "/addcard",
          state: { returnTo: "/subscribe", plan }
        });
      }
    }
  }
  return (
    <IonPage>
      <IonLoading isOpen={loading} message="Loading..." />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/myscore" />
          </IonButtons>
          <IonTitle>Plans for your privacy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="pricing-container">
          <h1>Friendly Pricing</h1>
          <p className="subtitle">
            A new and better way to acquire, engage and support customers
          </p>

          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={index} className="plan-card">
                <div className="plan-header">
                  <h2>{plan.type}</h2>
                  <p>{plan.description}</p>
                </div>

                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="interval">{plan.interval}</span>
                </div>

                <div className="features-section">
                  <h3>What's included?</h3>
                  <ul className="features-list">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className={feature.enabled ? 'enabled' : 'disabled'}
                      >
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <IonButton
                  expand="block"
                  className={plan.type === 'FREE' ? 'choose-button-dark' : 'choose-button-blue'}
                  onClick={() => routePayment(plan)}
                >
                  {/* {plan.type === 'FREE' ? 'Choose' : 'Subscribe'} */}
                  Choose
                </IonButton>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PaymentPage;