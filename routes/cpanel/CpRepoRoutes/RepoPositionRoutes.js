const express = require('express')

const RepoPositionController = require('../../../controllers/cpanel/repo/PositionRepoController')
const validate = require('../../../others/validation')


var router = express.Router();

router.get('/list',RepoPositionController.ListGet)

router.get('/new',RepoPositionController.SaveGet)

router.post('/new',validate.PositionRepoValidate,RepoPositionController.SavePost)

module.exports = router;