const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    orderId : {type:Number, required:true},
    consumerId : {type:Number, required: true},
    ratingValue : {type: Number , required:true, min:1 , max:5},
    comment : {type: String},
    is_del : {type:Boolean , default: false }
},{timestamps:true});

// ratingSchema.index({ orderId: 1, consumerId: 1 }); 
module.exports = mongoose.model('Rating', ratingSchema)