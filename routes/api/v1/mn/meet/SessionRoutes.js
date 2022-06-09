const express = require('express')
const Validate = require('../../../../../others/validation');
const auth = require('../../../../../others/auth');

const SessionController = require('../../../../../controllers/api/mentorship/meet/MnSessionController')

var router = express.Router();

router.post('/',auth.validateToken,Validate.MnMeetValidate,SessionController.Save) //only for mentor

module.exports = router;