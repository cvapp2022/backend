const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const BLPayment = new Schema({ 

    PaymentFor:{type:String,required:true},
    PaymentValue:{type:Number,required:true}, 
    PaymentWay:{type:String,required:true},
    PaymentOrder:{type: mongoose.Schema.Types.ObjectId,refPath: 'externalModelType'},
    externalModelType:{type: String},
});
      
 
      
module.exports = mongoose.model('BLPayment', BLPayment);