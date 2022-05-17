const mongoose = require('mongoose'); 
//Define a schema 
const Schema = mongoose.Schema;

const ClModel= new Schema({
    CLName:{type:String,required:true},
    CLUId:{type:mongoose.Schema.Types.ObjectId, ref: 'BLCVUser',required:true},
    CLFullName:{type:String},
    CLJob:{type:String},
    CLAddress:{type:String},
    CLMail:{type:String},
    CLPhone:{type:String},
    CLCmpName:{type:String},
    CLCmpHrName:{type:String},
    CLBody:{type:String},
})

module.exports = mongoose.model('BLCL', ClModel);