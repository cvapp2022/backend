const express = require('express');


const ProjController = require('../../../controllers/api/ProjController')
const Validate = require('../../../others/validation')
const auth = require('../../../others/auth');

const router = express.Router();

router.post('/',auth.validateToken,Validate.ProjValidate,ProjController.Save)

router.put('/:projId',auth.validateToken,Validate.ProjValidate,ProjController.Update)

router.delete('/:projId',auth.validateToken,ProjController.Delete)

module.exports = router;