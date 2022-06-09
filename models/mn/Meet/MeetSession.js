const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSessionModel = new Schema({
    SessionId:{ type: String, required: true },
    SessiomMeet:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeet'},
    SessionEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnSessionEvent' }],
    SessionAttachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionAttachment' }],
    SessionMessage:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionMessage' }],
    SessionPeers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionPeer' }],
    isActive:{type:Boolean,default:true}


});


module.exports = mongoose.model('MnMeetSession', SessionSessionModel);