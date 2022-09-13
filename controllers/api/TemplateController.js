const paypal = require('paypal-rest-sdk');
const TemplateModel = require('../../models/TemplateSchema');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQpSCYLR-kqiHBbfh6u71kVPFDXu0SxH2XtURgMKTdYx29L_t-0lbu2I9hvj-LONWt3hJAHh_8pojQsG',
    'client_secret': 'EHaUlC1JDqMwWKpML8Wtdl83w-JXER88s7TC9MnlYWGtADE7q_rQ4HBfU-1dFJkkKYFITA2udODQIrpU'
});

//
// sb-ah0ve20796660@business.example.com
// sb-axyv920783777@personal.example.com
// 58U|mq&y
// https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9GH42318L5297972L
exports.OrderTemplate = function (req, res) {



}


exports.PayTemplatePayPalReq = function (req, res) {

    //validate template param
    var templateId=req.params.templateId;
    console.log(templateId)

    //get template 
    TemplateModel.findById(templateId,function(err,result){
        if(!err && result){

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:5000/api/v1/Order/Template/"+templateId+"/orderPayPalExec",
                    "cancel_url": "http://localhost:5000/api/v1/Order/Template/"+templateId+"/orderPayPalCancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name":result.TemplateName+' '+result.TemplateFor+' template',
                            "price":result.TemplatePrice,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total":result.TemplatePrice
                    },
                    "description":result.TemplateDesc
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {

                    //create new template order

                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.send(payment.links[i].href);
                        }
                    }
                }
            });

        }
    })





}

exports.PayTemplatePayPalExec = function (req, res) {

    //validate template param
    var templateId=req.params.templateId;
    //get template 
    TemplateModel.findById(templateId,function(err,result){
        if(!err && result){
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const execute_payment_json = {
              "payer_id": payerId,
              "transactions": [{
                  "amount": {
                      "currency": "USD",
                      "total":result.TemplatePrice
                  }
              }]
            };
          
        
            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
              if (error) {
                  console.log(error.response);
                  throw error;
              } else {
                  console.log(JSON.stringify(payment));
        
                  //set payment to order and change order states
        
                  res.send('Success');
              }
          });
        
        }
    })



}