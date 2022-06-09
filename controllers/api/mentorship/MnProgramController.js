const MnProgramModel = require('../../../models/mn/MnProgramSchema')



module.exports.Get=function(req,res){

    //get programs
    MnProgramModel.find({ProgStatus:1},function(err,result){

        if(!err){
            return res.json({
                success:true,
                payload:result,
                message:'Programs Successfully loaded'
            })
        }
        else{
            return res.json({
                success:false,
                payload:null,
                message:'Unable to load programs'
            })
        }

    })
}