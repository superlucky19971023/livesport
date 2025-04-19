import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AddCard from './index';

// Load Stripe outside of the component to avoid recreating the Stripe object on every render
const stripePromise = loadStripe('pk_test_51R5r2PP8rwhLZO7wyuBkckbj4jKX2CtXLeBmrASOunl6Jngahn6zNk7IhkgPMoxGi9uar297Bc7vNjQ6S5hOIEzb00tFAgPxbb');

const AddCardWrapper: React.FC = () => {
  const options = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
      },
    ],
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Roboto, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <AddCard />
    </Elements>
  );
};

export default AddCardWrapper;
