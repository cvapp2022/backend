const express = require('express')


var MnMentorController =require('../../../controllers/cpanel/mentorship/MnMentorController')
const Validate = require('../../../others/validation')



var router = express.Router();



router.get('/new',MnMentorController.SaveGet)

router.post('/new',Validate.MnMentorValidate,MnMentorController.SavePost)

module.exports = router;