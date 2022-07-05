const { validationResult } = require('express-validator');

const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const MnMentorModel = require('../../../models/mn/MnMentorSchema')

const facades = require('../../../others/facades')

module.exports.SaveGet = function (req, res) {
    return res.render('cpanel/mentorship/programs/new')
}

module.exports.SavePost = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.status(400).json({
            success: false,
            payload: {err:errors.errors,body:req.body},
            msg: 'Validation x Error'
        });
    }

    //updload program image
    facades.createFolder(req.body.progNameI,'programs',function(folderId){

        facades.uploadFileTo(req.files.progImgI[0],'program',folderId,function(fildId){
            //save program
            var saveProgram = new MnProgramModel();
            saveProgram.ProgName = req.body.progNameI;
            saveProgram.ProgDesc = req.body.progDescI;
            saveProgram.ProgImg = fildId;
            saveProgram.ProgFolder=folderId;
            saveProgram.ProgMeetsNum = req.body.progMeetsNumI;
            saveProgram.save(function (err, result) {
        
                if (result && !err) {
                    return res.send('Program saved');
                }
                else {
                    return res.send('Somtign');
                }
        
            });
        })

    })




}

module.exports.ListGet = function (req, res) {


    //get programs & mentors 
    MnProgramModel.find({}, function (err, result) {
        return res.render('cpanel/mentorship/programs/programList', { 'programs': result, })
    })
    // Promise.all([,MnMentorModel.find({}).populate(population.MentorPopulation)]).then((val)=>{

    //     var programs =val[0];
    //     var mentors =val[1];

    // })

}

module.exports.ProgramOneGet = function (req, res) {


    //get program
    var progId = req.params.progId;
    Promise.all([MnProgramModel.findById(progId).populate(), MnMentorModel.find({ MentorStatus: 1 })]).then((val) => {

        var program = val[0];
        var mentors = val[1];

        var mentorsArr = [];
        mentors.forEach((item) => {
            var inProgram;
            if (program.ProgMentors.includes(item._id)) {
                inProgram = true;
            }
            else {
                inProgram = false;
            }
            mentorsArr.push({ item, inProgram });

        })
        return res.render('cpanel/mentorship/programs/programOne', { 'program': program, 'mentors': mentorsArr })

    })
}

module.exports.addMentorToProg = function (req, res) {

    var mentorId = req.body.mentorId;
    var progId = req.body.programId;
    if (!mentorId || !progId) {
        return res.send('validation error')
    }

    //push mentor to program
    Promise.all([MnProgramModel.findById(progId), MnMentorModel.findOne({ _id: mentorId, MentorStatus: 1 })]).then((val) => {

        var program = val[0];
        var mentor = val[1];
        if (program && mentor) {

            //check if mentor already in program
            if (program.ProgMentors.includes(mentor._id)) {
                res.send('mentor already in the program')
            }
            else {
                program.ProgMentors.push(mentor._id);
                program.save();

                mentor.MentorPrograms.push(program._id)
                mentor.save();
                res.send('mentor pushed')
            }

        }

    })
}

module.exports.removeMentorFromProg = function (req, res) {

    var mentorId = req.body.mentorId;
    var progId = req.body.programId;
    if (!mentorId || !progId) {
        return res.send('validation error')
    }

    //push mentor to program
    Promise.all([MnProgramModel.findById(progId), MnMentorModel.findOne({ _id: mentorId, MentorStatus: 1 })]).then((val) => {

        var program = val[0];
        var mentor = val[1];
        if (program && mentor) {

            //check if mentor already in program
            if (program.ProgMentors.includes(mentor._id)) {
                program.ProgMentors.pull(mentor._id);
                program.save();

                mentor.MentorPrograms.pull(program._id)
                mentor.save();
                res.send('mentor pulled')
            }
            else {
                res.send('mentor not in the program')
            }

        }

    })


}