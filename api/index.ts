import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(
  'sk_test_51JKifhDyfOCkv6r5arL0vG6OJrt4yFw6bbBLoMrjBMensljl1lIW2W0SCOcCOxdgcpfmwDhQNv7WUZBAwmqosUCl00pS39Vqq8',
  {
    apiVersion: '2020-08-27',
    typescript: true,
  },
);

const app = express();
app.use(express.json());

// app.post('/create-payment-intent', async (req, res) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 5000, // 50 $
//     currency: 'usd',
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2020-08-27' },
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    customer: customer.id,
  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
