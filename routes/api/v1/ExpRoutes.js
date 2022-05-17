const express = require('express');


const ExpController = require('../../../controllers/api/ExpController')
const Validate = require('../../../others/validation')
const auth = require('../../../others/auth');

const router = express.Router();



router.post('/',auth.validateToken,Validate.ExpValidate,ExpController.Save)

router.put('/:expId', auth.validateToken,Validate.ExpValidate,ExpController.Update);

router.delete('/:expId',auth.validateToken,ExpController.Delete);


module.exports = router;