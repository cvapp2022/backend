const { validationResult } = require('express-validator');
var ObjectId = require('mongoose').Types.ObjectId;

const CvModel=require('../../models/CvSchema');
const EduModel=require('../../models/EducationSchema');

const facade = require('../../others/facades')


exports.Save = function(req,res,next){

    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }


    //get & Check Cv id
    var CvId = req.body.EduCvI;
    facade.CheckCv(CvId,req.user._id,function(x){

        if(!x){
            return res.json({
                success:false,
                payload:null,
                msg:'Invalid cv' 
            });

        }
    })

    var SaveEdu=new EduModel();
    SaveEdu.CVId =CvId;
    SaveEdu.EduTitle=req.body.EduTitleI;
    SaveEdu.EduDesc=req.body.EduDescI;
    SaveEdu.EduType=req.body.EduTypeI;
    SaveEdu.EduFrom=req.body.EduFromI;
    SaveEdu.EduTo=req.body.EduToI;
    SaveEdu.EduSkill=req.body.EduSkillI;
    SaveEdu.save(function(err,result){

        if(!err){

            //push edu to Cv Exp Arr
            facade.PushToCvArr(CvId,'CVEdu',SaveEdu._id)

            //get list of educations
            EduModel.find({CVId:CvId}).populate({path:'EduSkill'}).exec(function(err2,result2){

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





exports.Update = function(req,res,next){


    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    //validate param
    var EduId=req.params.eduId;
    if(!ObjectId.isValid(EduId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }

    //find Edu & Update 
    var Update={
        EduTitle:req.body.EduTitleI,
        EduDesc:req.body.EduDescI, 
        EduFrom:req.body.EduFromI,
        EduTo:req.body.EduToI,
    }


    EduModel.findOneAndUpdate({_id:EduId},Update,function(err,result){

        //update Skill Array
        if(!err && result){
            console.log(result.EduSkill)
            if(result.EduSkill.length > 0){

                result.EduSkill.forEach(item => {
                    result.EduSkill.pull(item);
                });
                var newSkillArr= req.body.EduSkillI;
                newSkillArr.forEach(item=>{
                    result.EduSkill.push(item);
                })
                result.save();
            }
            return res.json({
                success:true,
                payload:result,
                msg:'Education Successfully Updated' 
            });

        }
        else{
            return res.json({
                success:false,
                payload:null,
                msg:'Unable to find education' 
            });
        }

    })




}



exports.Delete=function(req,res,next){

    var EduId=req.params.eduId;
    if(!ObjectId.isValid(EduId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }
    
    //Check Education & Delete  
    EduModel.findOneAndDelete({_id:EduId},function(err,result){

        if(!err && result){
            //Get CV & Remove Edu Id From CVEdu
            facade.PullCvArr(result.CVId,'CVEdu',EduId)
            EduModel.find({CVId:result.CVId},function(err2,result2){

                if(!err2){
                    return  res.json({
                        success:true,
                        payload:{
                            list:result2
                        },
                        msg:'Education succesfully Deleted' 
                    });
                }
                else{
                    return  res.json({
                        success:false,
                        payload:null,
                        msg:'unable to fetch education' 
                    });
                }

            })
        }
        else{
            return  res.json({
                success:false,
                payload:null,
                msg:'unable to delete education' 
            });
        }
    })
}
exports.ChangeSort=function(req,res){



    //validate input
    var items = req.body.items;

    if(items.length > 0){

        items.forEach(item => {
            EduModel.findOneAndUpdate({_id:item.id},{EduSort:item.sort+1},function(err,res){

                console.log(err)

            });
        });
        EduModel.find({CVId:req.body.CvId},function(err,result){

            if(!err && result){

                console.log(result)

                res.json(result)
            }
            else{
                res.send('unable to fetch ')
            }

        })

    }

}