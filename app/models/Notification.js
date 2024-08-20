const mongoose = require('mongoose')

// const pushNotifyBodySchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     body: { type: String, required: true },
//     icon: { type: String },      
//     clickAction: { type: String },
//     sound: { type: String },     
//     badge: { type: String }, 
//     tag: { type: String },  
//     color: { type: String }, 
//     priority: { type: String, enum: ['high', 'normal', 'low'] },
//     data: { type: mongoose.Schema.Types.Mixed },
//     timestamp: { type: Date, default: Date.now }
//   });


const notifySchema = new mongoose.Schema({
    title: { type: String,required:true},
    body: { type: String,required:false},
    message: { type: String,required:true},
    topic: { type: String },
    token: { type: String,},
    extId: { type: String,},
    senderExtId: { type: String ,required:false},
    receiverExtId: { type: String ,required:false},
    statusDescription: { type: String },
    status: { type: mongoose.Schema.Types.Mixed }, 
    notifyStatus: { type: String},
    tokens: [{ type: String }],
    tokenList: { type: String },
    actionName: { type: String,required:false},
    path: { type: String },
    userRole : { type: String, enum: ['ADMIN', 'CONSUMER', 'ENTERPRISE','DELIVERY_BOY']},
    redirect : { type: String, enum: ['ORDER']},
    is_del : {type:Boolean, default:false}
},{timestamps:true});
  
  module.exports = mongoose.model('Notification', notifySchema);