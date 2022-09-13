
const express = require('express');
const Validate = require('../../../others/validation');
const auth = require('../../../others/auth');
const TemplateController = require('../../../controllers/api/TemplateController');

const router = express.Router();

router.post('/:templateId/order',auth.validateToken,TemplateController.OrderTemplate)

router.get('/:templateId/orderPayPalReq',TemplateController.PayTemplatePayPalReq)

router.get('/:templateId/orderPayPalExec',TemplateController.PayTemplatePayPalExec)

router.get('/:templateId/orderPayPalCancel',auth.validateToken,(req, res) => res.send(' paypal payment Cancelled'))

module.exports = router;