const express = require('express')


var MnProgramController =require('../../../controllers/cpanel/mentorship/MnProgramController')
const Validate = require('../../../others/validation')



var router = express.Router();



router.get('/new',MnProgramController.SaveGet)

router.post('/new',Validate.MnProgramValidate,MnProgramController.SavePost)

router.get('/list',MnProgramController.ListGet)

router.get('/:progId',MnProgramController.ProgramOneGet)

router.post('/addMentorToProg',MnProgramController.addMentorToProg)

router.post('/removeMentorFromProg',MnProgramController.removeMentorFromProg)

module.exports = router;