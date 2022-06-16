const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MnMeetModel = new Schema({

    MeetName: { type: String, required: true },
    MeetId: { type: String, required: true },
    MeetDate:{type:Date,required:true},
    MeetStatus:{type:Boolean,default:0},
    MeetMentor:{ type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor' },
    MeetSession:[{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeetSession'}],
    MeetRates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnMeetRate' }],
    MeetRequest:{ type: mongoose.Schema.Types.ObjectId, ref: 'MnRequest' }
});

module.exports = mongoose.model('MnMeet', MnMeetModel);





// name: String, // session name
// meetingid: String, // meeting id
// sessionid: String, // socket id