const express = require('express');
const { validationResult } = require('express-validator')
const ContactModel = require('../../../../models/cv/ContactSchema')
const Validate = require('../../../../others/validation');
const auth = require('../../../../others/auth');


const router = express.Router();



router.put('/',auth.validateToken,Validate.ContactValidate,function(req,res){

        //validate inputs 
        const errors = validationResult(req);

        if(errors.errors.length > 0 ){
           return res.json({
                success:false,
                payload:errors.errors,
                msg:'Validation Error' 
            });
        }


    var update = {
        CValue:req.body.ContactValI
    }
    ContactModel.findOneAndUpdate({CKey:req.body.ContactNameI,CVId:req.body.CvIdI},update,function(err,result){
        if(!err && result){

            return  res.json({
                success:true,
                payload:result,
                msg:'Contact Successfully Updated' 
            })
        }
        else{
            return  res.json({
                success:false,
                payload:null,
                msg:'Unable to find Contact' 
            });
        }

    })


})



module.exports = router;