const express = require('express');
const multer = require('multer');


const CvController = require('../../../controllers/api/CvController');
const Validate = require('../../../others/validation');
const auth = require('../../../others/auth');

const upload = multer({limits:{fieldSize:1024}});
const router = express.Router();

router.post('/',auth.validateToken,Validate.CvValidate,CvController.Save);

router.get('/:cvId',auth.validateToken,CvController.Get);

router.put('/:cvId',auth.validateToken,Validate.CvValidate,CvController.Update)

router.delete('/:cvId',auth.validateToken,CvController.Delete)

const pUpload = upload.fields([{ name: 'ImgI', maxCount: 1 ,fieldSize:2046}])
router.post('/:cvId/setImg',auth.validateToken,pUpload,CvController.SetImg)

module.exports = router;