const { validationResult } = require('express-validator');

const MnMentorModel=require('../../../models/mn/MnMentorSchema')


module.exports.SaveGet = function(req,res){
    return res.render('cpanel/mentorship/mentors/new')
}

module.exports.SavePost = function(req,res){

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.status(400).json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //updload mentor image

    //save mentor
    var saveMentor=new MnMentorModel();
    saveMentor.MentorName=req.body.mentorNameI;
    saveMentor.MentorDesc=req.body.mentorDescI
    saveMentor.MentorMail=req.body.mentorMailI;
    saveMentor.MentorPhone=req.body.mentorPhoneI
    saveMentor.MentorPass=saveMentor.encryptPassword(req.body.mentorPassI);
    saveMentor.MentorImg='test';

    saveMentor.save(function(err,result){

        if(result && !err){
            return res.send('mentor saved');
        }
        else{
            return res.send('Somtign');
        }

    });

}