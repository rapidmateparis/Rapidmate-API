const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const utils = require('../../middleware/utils');
const { fetch, updateQuery } = require("../../middleware/db");
exports.saveCard = async (req, res) => {
    const { customerId, paymentMethodId } = req.body;

  try {
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        await stripe.customers.update(customerId, {invoice_settings: { default_payment_method: paymentMethodId }});
        return res.status(200).json(utils.buildUpdatemessage(200,'Card saved successfully!'));
    } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,"Unable to save card. Try next time.",1001));
    }
};

exports.payProceed = async (req,res)=>{
    const { amount, customerId, paymentMethodId } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: true,
        off_session: true, // Process without user input
      });
  
       return res.status(200).json(utils.buildCreateMessage(200,'Payment Successfully',{paymentIntent}))
    } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
    }
}

exports.cardLists = async (req,res) =>{
    try {
        const { customerId } = req.params;
        const paymentMethods = await stripe.paymentMethods.list({ customer: customerId, type: "card" });
        return res.status(200).json(utils.buildCreateMessage(200,'Payment Successfully',paymentMethods.data))
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
      }
}


exports.removeCard = async (req,res)=>{
    try {
        const { paymentMethodId } = req.body;
        await stripe.paymentMethods.detach(paymentMethodId);
        return res.status(200).json(utils.buildUpdatemessage(200,'Card removed successfully!'));
      } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
      }
}

exports.createCustomer = async (req,res)=>{
    const { email,role } = req.body;

    try {
      // 🔹 Check if the customer exists in your database
      let table='';
      if(role=='CONSUMER'){
        table='rmt_consumer'
      }
      if(role=='ENTERPRISE'){
        table='rmt_enterprise'
      }
      if(role=='DELIVERY_BOY'){
        table='rmt_delivery_boy'
      }
      if(!table){
        return res.status(400).json(utils.buildErrorObject(400,'Unable to find data.',1001));
      }
      const existingCustomer = await fetch(`SELECT stripe_customer_id FROM ${table} WHERE username = ?`, [email]);
  
      if (existingCustomer.length > 0 && existingCustomer[0].stripe_customer_id) {
        const data={ customer: { id: existingCustomer[0].stripe_customer_id } }
         return res.status(200).json(utils.buildCreateMessage(200,"Data retrieved.",data))
      }
      
      // 🔹 Create a new Stripe customer if not found
      const customer = await stripe.customers.create({ email });
  
      // 🔹 Store customer ID in your database
      await updateQuery(`UPDATE ${table} SET stripe_customer_id = ? WHERE username = ?`, [customer.id, email]);
      const data ={
        customer
      }
      return res.status(200).json(utils.buildCreateMessage(200,"Data retrieved.",data))
    } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,error.message,1001));
    }
}


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
  
      
       return res.status(200).json(utils.buildCreateMessage(200,'PaymentIntent created',{
        clientSecret: paymentIntent.client_secret,
      }))
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };