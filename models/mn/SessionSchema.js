const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const MnSession = new Schema({ 

    // CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
    // AwStatus:{type:Number,default:1},
    // AwTitle:{type:String,required:true},
    // AwDesc:{type:String,required:true}, 
    // AwJob:{type:String,required:true},
    // AwDate:{type:Date,required:true},
    // AwSort:{type:Number,default:0,required:true},
    message:{type:String,required:true},
    attachment:{type:String,required:true},
    sessionid:{type:String,required:true}, // user session id
    meetingid:{type:String,required:true} // meeting id

});

module.exports = mongoose.model('MNSession', MnSession);