const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
MentorModel = require('../../../models/mn/MnMentorSchema')
const RequestModel = require('../../../models/mn/MnRequestSchema')
const auth = require('../../../others/auth');
const facades=require('../../../others/facades');
const { MentorPopulation } = require('../../../others/populations');



module.exports.Get = function (req, res) {


    var u = req.user;
    res.json({
        success: true,
        payload: u,
        message: 'Mentor Successfully loaded'
    })


}


module.exports.Login = function (req, res) {



    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    MentorModel.findOne({ MentorMail: req.body.UserI }, function (err, result) {

        if (!err) {

            if (result === 'null') {
                return res.json({
                    success: false,
                    payload: null,
                    msg: 'Wrong username or password'
                });
            }
        }
        if (result) {

            if (bcrypt.compare(req.body.PassI, result.MentorPass)) {

                var token = auth.generateToken(result)
                //get mentor
                MentorModel.findById(result._id, function (err, result) {

                    if (!err && result) {

                        //get num of available requests
                        query = {ReqStatus:1,ReqState:'searching', ReqProg: { $in: result.MentorPrograms } };
                        RequestModel.find(query,function(err2,result2){
                            if(result2.length >0){

                                //push notification to mentor
                                facades.saveNotif('mentor',result._id,'RedirectToRequests','You Have '+result2.length+' Available Requests',true)
                       
                            }
                        })

                        return res.status(200).json({
                            success: true,
                            payload: {
                                'mentor': result,
                                token
                            }
                        });
                    }
                    else {
                        return res.json({
                            success: false,
                            payload: null,
                            msg: 'Unable to get mentor'
                        });
                    }

                }).populate(MentorPopulation)
            }
            else {
                return res.status(200).json({
                    success: false,
                    payload: null,
                    msg: 'Wrong username or password'
                });
            }

        }
        else {
            return res.status(200).json({
                success: false,
                payload: null,
                msg: 'Wrong username or password'
            });
        }
    }).lean();






}