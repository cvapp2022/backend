const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
MentorModel = require('../../../models/mn/MnMentorSchema')
const auth = require('../../../others/auth');





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

                })
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