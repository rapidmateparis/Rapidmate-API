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
    body: { type: String,required:false, default:''},
    message: { type: String,required:true},
    topic: { type: String ,default: ''},
    token: { type: String,default: ''},
    extId: { type: String,default: ''},
    senderExtId: { type: String ,required:false,default: ''},
    receiverExtId: { type: String ,required:false,default: ''},
    statusDescription: { type: String },
    status: { type: mongoose.Schema.Types.Mixed }, 
    notifyStatus: { type: String,required:false,default: ''},
    tokens: [{ type: String }],
    tokenList: { type: String , required: false, default: ''},
    actionName: { type: String, required: false, default: ''},
    path: { type: String,required: false, default: '' },
    userRole : { type: String, enum: ['ADMIN', 'CONSUMER', 'ENTERPRISE','DELIVERY_BOY']},
    redirect : { type: String, enum: ['ORDER']},
    is_del : {type:Boolean, default:false}
},{timestamps:true});
  
  module.exports = mongoose.model('Notification', notifySchema);