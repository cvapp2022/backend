const TemplateModel = require('../../models/TemplateSchema')
const facades = require('../../others/facades')
const { validationResult } = require('express-validator');


exports.ListGet=function(req,res){

    //fetch templates
    TemplateModel.find({},function(err,result){
        res.render('cpanel/templates/list',{templates:result})
    })
}


exports.NewGet = function (req, res) {
    res.render('cpanel/templates/new')
}

exports.NewPost = function (req, res) {

    //validate inputs
    const errors = validationResult(req);
    if (errors.errors.length > 0 || !req.files.templateThumbI) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, body: req.body },
            msg: 'Validation x Error'
        });
    } 

    //upload Template Thumbnail
    facades.uploadFileTo(req.files.templateThumbI[0], 'template',null, function (x) {

        //save Template
        let isPaid;
        let price;
        var templatePaid = req.body.templatePaidI;
        if (templatePaid === 'paid') {
            isPaid = true;
            price = req.body.templatePriceI;
        }
        else {
            isPaid = false;
            price = 0;
        }
    
        var saveTemplate = new TemplateModel();
        saveTemplate.TemplateName = req.body.templateNameI;
        saveTemplate.TemplateThumb = x;
        saveTemplate.TemplateDesc = req.body.templateDescI;
        saveTemplate.TemplatePrice = price;
        saveTemplate.TemplateFor=req.body.templateForI;
        saveTemplate.isPaid = isPaid;
        saveTemplate.save(function (err, result) {
            if(!err){

                //send notification to all users 
                facades.saveNotif('userall','','RedirectToCv','Check New Cv Template '+result.TemplateName)

                //trigger user 
                var io=req.app.get('socketio');
                io.emit('TEMPLATE_CREATED',{})

                return res.redirect('/Cpanel/Templates/new')
            }
            else{
                console.log(err)
            }
        })
    })
}

exports.Delete=function(req,res){

    //validate params
    var templateId=req.params.templateId;

    TemplateModel.findOneAndDelete({_id:templateId},function(err,result){
        if(!err){

            //trigger user 
            var io=req.app.get('socketio');
            io.emit('TEMPLATE_REMOVED',{})

            return res.redirect('/Cpanel/Templates/list')
        }
    })


}