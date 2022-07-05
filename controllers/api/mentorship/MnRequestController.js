const { validationResult } = require('express-validator')
const MnRequestModel = require('../../../models/mn/MnRequestSchema')
const UserModel = require('../../../models/UserSchema')
const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const MnMentorModel = require('../../../models/mn/MnMentorSchema')
const MnMeetModel = require('../../../models/mn/MnMeetSchema')
const populate = require('../../../others/populations')
const facades = require('../../../others/facades')


module.exports.Get = function (req, res) {

    var type = req.params.type;
    var user = req.user;
    let query;
    if (type === 'user') {
        query = { ReqUser: user._id }
    }
    else if (type === 'mentor') {
        //query={ ReqMentor:user._id};
        //get mentor 
        MnMentorModel.findById(user._id, function (err, result) {
            if (!err && result) {
                query = { ReqProg: { $in: result.MentorPrograms } };
            }
            else {

            }
        })


    }


    MnRequestModel.find(query, function (err2, result2) {

        if (!err2) {
            return res.json({
                success: true,
                payload: result2,
                message: 'Requests Successfully loaded'
            })
        }

    }).populate(populate.RequestPopulation)



    //get requests for mentor 

    // var mentor = req.user;
    // MnRequestModel.find({ ReqMentor:mentor._id}, function (err2, result2) {
    //     if (!err2 && result2 ) {
    //         return res.json({
    //             success: true,
    //             payload: result2,
    //             message: 'Requests Successfully loaded'
    //         })
    //     }
    // }).populate(populate.RequestPopulation)

    // MnMentorModel.findById(mentor._id, function (err, result) {

    //     if (!err && result) {
    //         MnRequestModel.find({ ReqProg: { $in: result.MentorPrograms }}, function (err2, result2) {
    //             console.log(err2,result)
    //             if (!err2 && result2 ) {
    //                 return res.json({
    //                     success: true,
    //                     payload: result2,
    //                     message: 'Requests Successfully loaded'
    //                 })
    //             }
    //             else{
    //                 console.log(err2)
    //             }

    //         }).populate(populate.RequestPopulation)
    //     }

    // })

}




module.exports.Save = function (req, res) {


    //user id
    var userId = req.user._id;

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //check program request 
    MnProgramModel.findOne({ _id: req.body.requestProgramIdI, ProgStatus: 1 }, function (err, result) {

        if (!err && result) {
            //check user has no active requests in program
            MnRequestModel.find({ ReqUser: userId, ReqProg: req.body.requestProgramIdI }, function (err2, result2) {
                if (!err2 && result2.length > 0) {
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable To Save Request ,Already Has Request '
                    })
                }
                else {
                    var saveRequest = MnRequestModel();
                    saveRequest.ReqType = req.body.requestTypeI;
                    saveRequest.ReqProg = req.body.requestProgramIdI;
                    saveRequest.ReqSource = 'website';
                    saveRequest.ReqDates = req.body.requestDatesI
                    saveRequest.ReqUser = userId;
                    saveRequest.save(function (err3, result3) {

                        if (!err3 && result3) {

                            //push request to user mn requests       
                            UserModel.findOne({ _id: userId }, function (err4, result4) {
                                console.log(err4)

                                if (result4 && !err4) {
                                    result4['MNRequests'].push(result3._id)
                                    result4.save();
                                }
                            })

                            return res.json({
                                success: true,
                                payload: null,
                                message: 'Request Successfully saved'
                            })
                        }
                        else {
                            return res.json({
                                success: false,
                                payload: null,
                                message: 'Unable to save Request '
                            })
                        }

                    })
                }
            })

        } else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to find program'
            })

        }

    })





}

module.exports.Pay = function (req, res) {

    //update Request state 
    MnRequestModel.findByIdAndUpdate(req.params.reqId, { ReqState: 'searching' }, function (err, result) {

        if (!err && result) {
            return res.json({
                success: true,
                payload: result,
                message: 'Request Successfully Paid'
            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to update Request State'
            })
        }
    })
}

module.exports.Apply = function (req, res) {

    //check param

    //get request and mentor
    var mentor = req.user;
    MnMentorModel.findById(mentor._id, function (err, result) {

        if (!err && result) {
            MnRequestModel.findById(req.params.reqId, async function (err2, result2) {
                if (!err2 && result2) {
                    
                    //push request to mentor requests
                    result.MentorRequests.push(result2._id)
                    result.save();

                    //generate Meets
                    var meetsCount = result2.ReqProg.ProgMeetsNum;
                    var meetsArr=[];
                    for  (let i = 0; i < meetsCount; i++) { 
                        var random = (Math.random() + 1).toString(36).substring(4);
                        var obj={
                            MeetName:'luccter ' + i+1,
                            MeetId:random,
                            MeetMentor:result._id,
                            MeetRequest:result2._id
                        };
                        meetsArr.push(obj)
                    }
                    MnMeetModel.insertMany(meetsArr).then((result3)=>{

                        //update Request
                        var meetsIdArr=result3.map(doc => doc._id);
                        result2.ReqMentor = result._id;
                        result2.ReqMeets=meetsIdArr;
                        result2.ReqState = 'applied';
                        result2.save(function(err4,result4){
                            if(!err4 && result4){
                                console.log(result4)
                                return res.json({
                                    success: true,
                                    payload: result4,
                                    message: 'Request Successfully Applied'
                                })
                            }

                        });
                        
                    })
                }
            }).populate(populate.RequestPopulation);
        }

    })
}


