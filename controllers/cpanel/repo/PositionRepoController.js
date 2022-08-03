const PositionRepo = require('../../../models/repo/PositionRepoSchema')
const { validationResult } = require('express-validator');


exports.ListGet=function(req,res){
    
    //get repo items 
    PositionRepo.find({},function(err,result){
        if(!err){
            return res.render('cpanel/repo/position/list',{positions:result})
        }
    })

}

exports.SaveGet=function(req,res){
    return res.render('cpanel/repo/position/new')
}

exports.SavePost=function(req,res){

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, body: req.body },
            msg: 'Validation x Error'
        });
    }

    //save position in repo 
    var savePositionRepo=new PositionRepo();
    savePositionRepo.PositionName=req.body.positionNameI;
    savePositionRepo.PositionDesc=req.body.positionDescI;
    savePositionRepo.save(function(err,result){
        if(!err){
            return res.send('position repo saved')
        }
    })
}