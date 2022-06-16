const { validationResult } = require('express-validator')
const MnRequestModel = require('../../../models/mn/MnRequestSchema')
const UserModel = require('../../../models/UserSchema')
const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const MnMentorModel = require('../../../models/mn/MnMentorSchema')
const populate =require('../../../others/populations')



module.exports.Get = function (req, res) {

    var type = req.params.type;
    var user = req.user;
    let query;
    if(type === 'user'){
        query={ ReqUser:user._id}
    }
    else if(type === 'mentor'){
        query={ ReqMentor:user._id};
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
    MnProgramModel.find({ _id: req.body.requestProgramIdI, ProgStatus: 1 }, function (err, result) {

        if (err || !result) {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to find program'
            })
        }

    })



    var saveRequest = MnRequestModel();
    saveRequest.ReqType = req.body.requestTypeI;
    saveRequest.ReqProg = req.body.requestProgramIdI;
    saveRequest.ReqSource = 'website';
    saveRequest.ReqDates = req.body.requestDatesI
    saveRequest.ReqUser = userId;
    saveRequest.save(function (err, result) {

        if (!err && result) {

            //push request to user mn requests       
            UserModel.findOne({ _id: userId }, function (err2, result2) {
                console.log(err2)

                if (result2 && !err2) {
                    result2['MNRequests'].push(result._id)
                    result2.save();
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
        else{
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

    //Set Request mentor and update Request state 
    MnRequestModel.findByIdAndUpdate(req.params.reqId, { ReqMentor: mentor._id, ReqState: 'applied' }, function (err, result) {

        if (!err && result) {

            //push request to mentor requests
            MnMentorModel.findById(mentor._id, function (err2, result2) {

                if (!err2 && result2) {
                    result2.MentorRequests.push(result._id)
                    result2.save();
                    return res.json({
                        success: true,
                        payload: result,
                        message: 'Request Successfully Applied'
                    })

                } else {
                    return res.json({
                        success: false,
                        payload: err2,
                        message: 'Unable to find mentor'
                    })
                }

            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to find request'
            })
        }

    });


    //


}


