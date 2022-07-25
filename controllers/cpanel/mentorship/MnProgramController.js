const { validationResult } = require('express-validator');

const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const MnMentorModel = require('../../../models/mn/MnMentorSchema')
const PreparationModel=require('../../../models/mn/Program/PreparationSchema')

const facades = require('../../../others/facades')

module.exports.SaveGet = function (req, res) {
    return res.render('cpanel/mentorship/programs/new')
}

module.exports.SavePost = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0 || !req.files.progImgI ) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, body: req.body },
            msg: 'Validation x Error'
        });
    }

    //updload program image
    facades.createFolder(req.body.progNameI, 'programs', function (folderId) {
        facades.uploadFileTo(req.files.progImgI[0], 'program', folderId, function (fildId) {
            //generate preparation
            var prepsArr = [];
            for (let i = 0; i < req.body.progMeetsNumI; i++) {
                var obj = {
                    PrepareName: 'preparation for meet ' + i,
                    PrepareMeet: i,
                };
                prepsArr.push(obj)
            }

            PreparationModel.insertMany(prepsArr).then((result)=>{

                //collect preparation Ids
                var perpIdArr=result.map(doc => doc._id);

                //save program
                var saveProgram = new MnProgramModel();
                saveProgram.ProgName = req.body.progNameI;
                saveProgram.ProgDesc = req.body.progDescI;
                saveProgram.ProgImg = fildId;
                saveProgram.ProgFolder = folderId;
                saveProgram.ProgPreparation=perpIdArr;
                saveProgram.ProgMeetsNum = req.body.progMeetsNumI;
                saveProgram.save(function (err, result2) {
                    if (result2 && !err) {
                        
                        //create folder for meets preparation
                        facades.createFolder('preparation',folderId,function(prepFolder){

                            result.forEach((item)=>{

                                //create folder to prepare item and update it
                                facades.createFolder(item.PrepareName,prepFolder,function(perpOneFolder){

                                    //update preparation
                                    item.prepareFolder=perpOneFolder;
                                    item.save();
                                })
                            })
                            var io = req.app.get('socketio');
                            //send notifiacation to user
                            facades.saveNotif('userall','','RedirectToProgram','Check New Program '+result2.ProgName,true,io)
                            
                            //send socket to all users to update program
                            var io=req.app.get('socketio');
                            io.emit('PROGRAM_CREATED',result2)

                            return res.send('Program saved');
                        })
                    }
                    else {
                        return res.send('Somtign');
                    }
                });
            })
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
    Promise.all([MnProgramModel.findById(progId).populate('ProgPreparation'), MnMentorModel.find({ MentorStatus: 1 })]).then((val) => {

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

                var io = req.app.get('socketio');
                //send notification 
                facades.saveNotif('mentor',mentorId,'RedirectToPrograms','your account Added to '+program.ProgName+' mentorship program',true,io)
                //trigger mentor 
                var io=req.app.get('socketio');
                io.to(mentorId).emit('MENTOR_ADDED_TO_PROGRAM') 
                
                res.send('mentor pushed')
                // io.sockets.in('test').broadcast('MENTOR_ADDED_TO_PROGRAM')
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

                var io = req.app.get('socketio');
                //send notification
                facades.saveNotif('mentor',mentorId,'RedirectToPrograms','your account Removed From '+program.ProgName+' mentorship program',true,io)

                //trigger mentor
                var io=req.app.get('socketio');
                io.to(mentorId).emit('MENTOR_REMOVED_FROM_PROGRAM')
                res.send('mentor pulled')
            }
            else {
                res.send('mentor not in the program')
            }

        }

    })


}