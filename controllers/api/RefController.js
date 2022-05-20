const { validationResult } = require('express-validator');

const RefModel=require('../../models/ReffernceSchema');
const CvModel=require('../../models/CvSchema');
var ObjectId = require('mongoose').Types.ObjectId;
const facade = require('../../others/facades');



exports.Save= function(req,res,next){


    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var CvId = req.body.RefCvI;
    facade.CheckCv(CvId,req.user._id,function(x){

        if(!x){
            return res.json({
                success:false,
                payload:null,
                msg:'Invalid cv' 
            });

        }
    })
    //console.log(req.user)

    var SaveRef = new RefModel();
    SaveRef.CVId=CvId;
    SaveRef.RefName=req.body.RefNameI;
    SaveRef.RefJob=req.body.RefJobI;
    SaveRef.RefMail=req.body.RefMailI;
    SaveRef.RefPhone=req.body.RefPhoneI;
    SaveRef.save(function(err,result){

        if(!err){
            //push ref to Cv Exp Arr
            facade.PushToCvArr(CvId,'CVReff',SaveRef._id)

            //ge list of reffrences
            RefModel.find({CVId:CvId},function(err2,result2){

                if(!err2){
                    return res.status(201).json({
                        status:true,
                        items:{
                            item:result,
                            list:result2
                        }
                    });
                }
            })
        }

    })
}







exports.Update=function(req,res,next){

    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
       return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var RefId=req.params.refId;
    if(!ObjectId.isValid(RefId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }

    var Update = {
        RefName:req.body.RefNameI,
        RefJob:req.body.RefJobI, 
        RefMail:req.body.RefMailI,
        RefPhone:req.body.RefPhoneI
    };

    RefModel.findOneAndUpdate({_id:RefId},Update,function(err,result){

        if(!err && result){
            return  res.json({
                success:true,
                payload:result,
                msg:'Reffrence Successfully Updated' 
            });
        }
        else{
            return  res.json({
                success:false,
                payload:errors.errors,
                msg:'Unable to find Project' 
            });
        }



    })





}







exports.Delete=function(req,res,next){

    var RefId=req.params.refId;
    if(!ObjectId.isValid(RefId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }
    
    //Check Education & Delete  
    RefModel.findOneAndDelete({_id:RefId},function(err,result){

        if(!err && result){
            //Get CV & Remove Edu Id From CVEdu
            facade.PullCvArr(result.CVId,'CVReff',RefId)
            RefModel.find({},function(err2,result2){

                if(!err2){

                    return  res.json({
                        success:true,
                        payload:{
                            list:result2
                        },
                        msg:'Reffrence Succesfuly Deleted' 
                    });
                }
                else{
                    return  res.json({
                        success:false,
                        payload:null,
                        msg:'unable to fetch Reffrence' 
                    });
                }

            })
        }
        else{
            return  res.json({
                success:false,
                payload:null,
                msg:'unable to delete Reffrence' 
            });
        }
    })

}


exports.ChangeSort=function(req,res){



    //validate input
    var items = req.body.items;

    if(items.length > 0){

        items.forEach(item => {
            RefModel.findOneAndUpdate({_id:item.id},{RefSort:item.sort+1},function(err,res){

                console.log(err)

            });
        });
        RefModel.find({CVId:req.body.CvId},function(err,result){

            if(!err && result){
                res.json(result)
            }
            else{
                res.send('unable to fetch ')
            }

        })

    }

}