const stripe = require('stripe')('sk_test_51Nwiv8KyrenLPb5MbU0nFC5EMqAQ0pw973dHfSKBB5VlU0BuN6Nh30oKgmpRuQexelG33Ci3Q4354sBvp22LYDjb00RhoCZV26');

const createCustomer = async (name, email, paymentMethodId) => {
  return await stripe.customers.create({
    name,
    email,
    payment_method: paymentMethodId,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
};

const chargeCustomer = async (customerId, amount) => {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    off_session: true,
    confirm: true,
  });
};

module.exports = {
  createCustomer,
  chargeCustomer,
};
