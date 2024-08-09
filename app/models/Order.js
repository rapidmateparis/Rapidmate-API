const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  order_number: { type: [Number], required: true },
  latitude: {type: mongoose.Schema.Types.Decimal128,required: true,},
  longitude: {type: mongoose.Schema.Types.Decimal128,required: true,},
  createdOn: {type: Date,default: Date.now,},
  updatedOn: {type: Date,default: Date.now,}
}, {
  timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }
});

module.exports = mongoose.model('Order', OrderSchema);
