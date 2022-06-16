const SessionModel = require('../../../../models/mn/Meet/MeetSession')
const MeetModel = require('../../../../models/mn/MnMeetSchema')


module.exports.Save = function (req, res) {


    //
    // SessionId:{ type: String, required: true },
    // SessionEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnSessionEvent' }],
    // SessionAttachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionAttachment' }],
    // SessionMessage:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionMessage' }],
    // SessionPeers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionPeer' }],
    // isActive:{type:Boolean,default:true}

    //validate input
    if (!req.body.MeetIdI) {
        return res.json({
            success: false,
            payload: null,
            message: 'validation error'
        })
    }



    //save session 
    var saveSession = new SessionModel();
    var random = (Math.random() + 1).toString(36).substring(4);
    saveSession.SessionId = random;
    saveSession.SessionMeet=req.body.MeetIdI;
    saveSession.save(function (err, result) {

        if (!err && result) {

            //push session to meet
            MeetModel.findById(req.body.MeetIdI,function(err2,result2){

                if(!err2 && result2){
                    result2.MeetSession.push(result._id)
                    result2.save();
                    return res.json({
                        success: true,
                        payload: result,
                        message: 'Session Successfully created'
                    })
                }
                else{
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable to find Meet'
                    })
                }

            })

        }
        else{
            return res.json({
                success: true,
                payload: null,
                message: 'Unable to create Session'
            })
        }

    });





}