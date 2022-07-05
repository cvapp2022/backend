const express = require('express')


var MnProgramController =require('../../../controllers/cpanel/mentorship/MnProgramController')
const MnProgramPreparation=require('../../../controllers/cpanel/mentorship/program/MnProgramPreparationController')
const Validate = require('../../../others/validation')
const multer = require('multer');


var router = express.Router();
const upload = multer({limits:{fieldSize:1024}});


router.get('/new',MnProgramController.SaveGet)

const pUpload = upload.fields([{ name: 'progImgI', maxCount: 1 ,fieldSize:2046}])
router.post('/new',pUpload,MnProgramController.SavePost)

router.get('/list',MnProgramController.ListGet)

router.get('/:progId',MnProgramController.ProgramOneGet)

router.get('/:progId/preparation/new',MnProgramPreparation.SaveGet)

router.post('/:progId/preparation/new',MnProgramPreparation.SavePost)

router.post('/addMentorToProg',MnProgramController.addMentorToProg)

router.post('/removeMentorFromProg',MnProgramController.removeMentorFromProg)

module.exports = router;