const express = require('express');
const { createCustomerHandler, chargeCustomerHandler } = require('./controllers/paymentController');
const { chargeCustomer } = require('./services/stripeService');

const router = express.Router();

router.post('/customer', createCustomerHandler);
router.post('/charge', async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    if (!amount) {
      return res.status(400).send({ error: 'Amount is required' });
    }
    const paymentIntent = await chargeCustomer(customerId, amount);
    res.status(200).send(paymentIntent);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
