const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.makePaymentIntent = async (req, res) => {
  try {
    const { amount, currency ,customerId} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency?.toLowerCase() || "eur",
      payment_method_types: ["card"],
      customer: customerId,
      setup_future_usage: "off_session", // Add other methods if needed
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
