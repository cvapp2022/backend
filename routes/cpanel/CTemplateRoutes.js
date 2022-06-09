const express = require('express')

var router = express.Router();

const CTemplateController = require('../../controllers/cpanel/CTemplateController')

router.get('/new',CTemplateController.NewGet)

router.post('/new',CTemplateController.NewPost)

module.exports = router;