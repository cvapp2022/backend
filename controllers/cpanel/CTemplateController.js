const TemplateModel = require('../../models/TemplateSchema')




exports.NewGet = function (req, res) {
    res.render('cpanel/templates/new')
}

exports.NewPost = function (req, res) {


    //validate inputs 


    //upload Template Thumbnail



    let isPaid;
    let price;
    var templatePaid=req.body.templatePaidI;
    if(templatePaid === 'paid'){
        isPaid=true;
        price=req.body.templatePriceI;
    }
    else{
        isPaid=false;
        price=0;
    }
    
    var saveTemplate =new TemplateModel();
    saveTemplate.TemplateName=req.body.templateNameI;
    saveTemplate.TemplateThumb='xxxx';
    saveTemplate.TemplateDesc=req.body.templateDescI;
    saveTemplate.TemplatePrice=price;
    saveTemplate.isPaid=isPaid;
    saveTemplate.save(function(err,result){
        res.send(result)
    })


}