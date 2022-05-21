const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const MnMeets = new Schema({ 

    // CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},

    name:{type:String,required:true},
    meetingid:{type:String,required:true}, // meeting id
    sessionid:{type:String,required:true}, // user session id
   

});

module.exports = mongoose.model('MNSMeets', MnMeets);





// name: String, // session name
// meetingid: String, // meeting id
// sessionid: String, // socket id