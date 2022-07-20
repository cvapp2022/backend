const { validationResult } = require('express-validator');

const MnMentorModel = require('../../../models/mn/MnMentorSchema')
const facades = require('../../../others/facades')

module.exports.SaveGet = function (req, res) {
    return res.render('cpanel/mentorship/mentors/new')
}

module.exports.SavePost = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0 || !req.files.mentorImgI) {
        return res.status(400).json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //check mentor is unique
    MnMentorModel.find({ MentorMail: req.body.mentorMailI }, function (err, result) {

        if (!err && result.length > 0) {
            return res.status(400).json({
                success: false,
                payload: null,
                msg: 'Mentor Email Already in use'
            });
        }
        else if (!err && result.length === 0 ) {

            //updload mentor image
            facades.createFolder(req.body.mentorNameI, 'mentors', function (folderId) {

                facades.uploadFileTo(req.files.mentorImgI[0], 'mentor', folderId, function (fildId) {

                    //save mentor
                    var saveMentor = new MnMentorModel();
                    saveMentor.MentorName = req.body.mentorNameI;
                    saveMentor.MentorDesc = req.body.mentorDescI
                    saveMentor.MentorMail = req.body.mentorMailI;
                    saveMentor.MentorPhone = req.body.mentorPhoneI
                    saveMentor.MentorPass = saveMentor.encryptPassword(req.body.mentorPassI);
                    saveMentor.MentorImg = fildId;
                    saveMentor.MentorFolder = folderId;

                    saveMentor.save(function (err, result) {

                        if (result && !err) {
                            return res.send('mentor saved');
                        }
                        else {
                            return res.send('Somtign');
                        }

                    });

                })
            })
        }
        else{
            return res.send('unable to save mentor');
        }
    })


}