const BlogPostController = require('../../../controllers/cpanel/blog//BlogPostController')
const validation =require('../../../others/validation');
const express = require('express')


var router = express.Router();

router.get('/list',BlogPostController.ListGet)

router.get('/new',BlogPostController.SaveGet)

router.post('/new',validation.BlogPostValidate,BlogPostController.SavePost)

router.get('/:postId/:lang/new',BlogPostController.SaveChildGet)

router.post('/:postId/:lang/new',validation.BlogPostChild,BlogPostController.SaveChildPost)

module.exports = router;