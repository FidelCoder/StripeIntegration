const { createCustomer, chargeCustomer } = require('../services/stripeService');
const stripe = require('stripe')("SECRET_KEY");

const createCustomerHandler = async (req, res) => {
  const { name, email, paymentMethodId } = req.body;

  try {
    const customer = await createCustomer(name, email, paymentMethodId);
    res.status(200).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

const chargeCustomerHandler = async (req, res) => {
  const { customerId, amount, paymentMethod } = req.body;

  try {
    // Create a PaymentMethod
    const paymentMethodResponse = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: paymentMethod.card.number,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        cvc: paymentMethod.card.cvc,
      },
    });

    // Attach the PaymentMethod to the customer
    await stripe.paymentMethods.attach(paymentMethodResponse.id, {
      customer: customerId,
    });

    // Create a PaymentIntent with the PaymentMethod
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodResponse.id,
      confirm: true, // Automatically confirm the PaymentIntent
    });

    res.status(200).json({ message: 'Payment successful', paymentIntent });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment failed', details: error.message });
  }
};

module.exports = {
  createCustomerHandler,
  chargeCustomerHandler,
};
