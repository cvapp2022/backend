const { validationResult } = require('express-validator')
const queryString =require('query-string')
const bcrypt = require('bcryptjs');
const axios = require('axios')
const UserModel = require('../../models/UserSchema');
const facades = require('../../others/facades');
const auth = require('../../others/auth');




exports.Get= function(req,res){


    //get user 
    var u = req.user;
    var user = facades.GetUser(u._id,true,function(x){
        if(x){
            res.json({
                success:true,
                payload:x,
                message:'User Successfully loaded'
            })
        }
        else{
            res.json({
                success:false,
                payload:null,
                message:'Unable to load User '                
            })
        }
    });
    

}


exports.Save= function(req,res,next){

    
    //validate Inputs 
    const errors = validationResult(req);

    if(errors.errors.length > 0 ){
       return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var mail=req.body.MailI;
    var username=mail.split('@');
        
        //Create New User
        var SaveUser= new UserModel();

        SaveUser.CVUserName=username[0];
        SaveUser.CVFullName=req.body.FullNameI;
        SaveUser.CVUserMail=mail;
        SaveUser.CVUserFrom='mail';
        SaveUser.CVUserStatus=1;
        SaveUser.CVUserPlan=0;
        SaveUser.CVUserPass=SaveUser.encryptPassword('123456');
        SaveUser.save(function(err2,result2){
            if(!err2 && result2 ){
        
                var token = auth.generateToken(result2.toJSON())
                var user = facades.GetUser(result2._id,true,function(x){

                    //trigger user 
                    var io = req.app.get('socketio');
                                            

                    facades.saveNotif('user',result2._id,'RedirectToDashboard','Your Account Successfully Registerd',false,io)

                    return res.json({
                        success:true,
                        payload:{ 'user':x,token},
                        message:'User Successfully Registerd'
                    });
                })

            }
        })
}


exports.Login = function(req,res,next){


    //validate Inputs 
    const errors = validationResult(req);

    if(errors.errors.length > 0 ){
       return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }


    UserModel.findOne({CVUserMail:req.body.UserI},function(err,result){

        if(!err){
     
            if(result === 'null'){
                return res.json({
                    success:false,
                    payload:null,
                    msg:'Wrong username or password' 
                });
            }

            if(result){

                if(bcrypt.compare(req.body.PassI, result.CVUserPass)){

                    var token=auth.generateToken(result)
                    facades.GetUser(result._id,true,function(x){

                        return res.status(200).json({
                            success:true,
                            payload:{
                                'user':x,
                                token
    
                            }
                        });
                    })

                   
                }
                else{
                    return res.status(200).json({
                        success: false,
                        payload: null,
                        msg: 'Wrong username or password'
                    });
                }

            }
            else{
                return res.status(200).json({
                    success: false,
                    payload: null,
                    msg: 'Wrong username or password'
                });
            }

        }

    }).lean();
    //res.send(CheckUser.length);
}


exports.loginGoogle=function(req,res,next){
    
    var code =req.query.code;
    axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
          client_id: process.env.GOOGLE_CLI_ID,
          client_secret: process.env.GOOGLE_CLI_SECERET,
          redirect_uri: process.env.GOOGLE_CLI_REDIRECT_URL,
          grant_type: 'authorization_code',
          code,
        },
    }).then(function(resp){

        //get user data 
        axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
              Authorization: `Bearer ${resp.data.access_token}`,
            },
        }).then(function(resp2){
            
            //check if use exist 
            UserModel.findOne({CVUserMail:resp2.data.email},function(err3,result){

                //res.send(result) 
                if(!err3 && result ){
                    var token = auth.generateToken(result.toJSON())
                    return res.send(token);
                }
                else{

                    //register new user
                    
                        //generate random password
                        let password = (Math.random() + 1).toString(36).substring(2);
                        var mail=resp2.data.email;
                        var username=mail.split('@');
                          
                        //Create New User
                        var SaveUser= new UserModel();
                  
                        SaveUser.CVUserName=username[0];
                        SaveUser.CVFullName=resp2.data.name;
                        SaveUser.CVUserMail=mail;
                        SaveUser.CVUserFrom='google';
                        SaveUser.CVUserStatus=1;
                        SaveUser.CVUserPlan=0;
                        SaveUser.CVUserPass=SaveUser.encryptPassword(password);
                        SaveUser.save(function(err3,result2){
                            if(!err3 && result2){
                                facades.GetUser(result2._id,true,function(x){

                                    var token=auth.generateToken(result2.toJSON())
                                    return res.json({
                                        success:true,
                                        payload:{token,x},
                                        message:'User Successfully registerd with google'
                                    })
                 
                                })
                            }
                        })
                }

            })
        })
        .catch(err2 => next(err2));

    })
    .catch(err => next(err));
    //console.log(test)
}



exports.loginGithub=function(req,res,next){

    var code =req.query.code;

    axios({
        url: 'https://github.com/login/oauth/access_token',
        method: 'get',
        params: {
          client_id: process.env.GITHUB_CLI_ID,
          client_secret: process.env.GITHUB_CLI_SECERET,
          redirect_uri: process.env.GITHUB_CLI_REDIRECT_URL,
          code,
        },
      }).then(function(resp){

        const parsedData = queryString.parse(resp.data);
        console.log(parsedData.access_token); 
        axios({
            url: 'https://api.github.com/user/emails',
            method: 'get',
            headers: {
              Authorization: `token ${parsedData.access_token}`,
            },
          }).then(function(resp2){

            //check if use exist 
            UserModel.findOne({CVUserMail:resp2.data[0].email},function(err3,result){

                //res.send(result) 
                if(!err3 && result ){
                    var token = auth.generateToken(result.toJSON())
                    return res.send(token);
                }
                else{

                    //register new user
                    
                        //generate random password
                        let password = (Math.random() + 1).toString(36).substring(2);
                        var mail=resp2.data[0].email;
                        var username=mail.split('@');
                            
                        //Create New User
                        var SaveUser= new UserModel();
                    
                        SaveUser.CVUserName=username[0];
                        SaveUser.CVFullName=username[0];
                        SaveUser.CVUserMail=mail;
                        SaveUser.CVUserFrom='github';
                        SaveUser.CVUserStatus=1;
                        SaveUser.CVUserPlan=0;
                        SaveUser.CVUserPass=SaveUser.encryptPassword(password);
                        SaveUser.save(function(err3,result2){
                            if(!err3 && result2){

                                facades.GetUser(result2._id,true,function(x){

                                    var token=auth.generateToken(result2.toJSON())
                                    return res.json({
                                        success:true,
                                        payload:{token,x},
                                        message:'User Successfully registerd with github'
                                    })
                 
                                })
                                
                            }
                        })
                }

            })

          }).catch(err2 => next(err2));
       
        //res.send(resp.data)

      })
      .catch(err => next(err));

    //res.send(code)


}




exports.loginLinkedin=function(req,res,next){

    var code =req.query.code;

 
    axios({
        url: 'https://www.linkedin.com/oauth/v2/accessToken',
        method: 'get',
        params: {
          client_id: process.env.LINKEDIN_CLI_ID,
          client_secret: process.env.LINKEDIN_CLI_SECERET,
          redirect_uri: process.env.LINKEDIN_CLI_REDIRECT_URL,
          grant_type:'authorization_code',
          code,
        },
      }).then(function(resp){

        axios({
            url: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
            method: 'get',
            headers: {
              Authorization: `Bearer ${resp.data.access_token}`,
            },
          }).then(function(resp2){

            var mail=resp2.data.elements[0]["handle~"]['emailAddress'];
 
            //check if use exist 
            UserModel.findOne({CVUserMail:mail},function(err3,result){

                //res.send(result) 
                if(!err3 && result ){
                    var token = auth.generateToken(result.toJSON())
                    return res.json({
                        success:true,
                        payload:token,
                        message:'Loggedin With Linked-in Success' 
                    });
                    //return res.send(token);
                }
                else{

                    //register new user
                    
                        //generate random password
                        let password = (Math.random() + 1).toString(36).substring(2);
                        var mail=resp2.data.elements[0]['handle~'].emailAddress;
                        var username=mail.split('@');
                            
                        //Create New User
                        var SaveUser= new UserModel();
                    
                        SaveUser.CVUserName=username[0];
                        SaveUser.CVFullName=username[0];
                        SaveUser.CVUserMail=mail;
                        SaveUser.CVUserFrom='github';
                        SaveUser.CVUserStatus=1;
                        SaveUser.CVUserPlan=0;
                        SaveUser.CVUserPass=SaveUser.encryptPassword(password);
                        SaveUser.save(function(err3,result2){
                            if(!err3 && result2){
                                var token = auth.generateToken(result2.toJSON());
                                return res.json({
                                    success:true,
                                    payload:token,
                                    message:'registerd With Linked-in Success' 
                                });
                             
                            }
                        })
                }

            })


          })
          .catch(err => console.log(err.response));

        //res.send(resp.data)
        
      })
      .catch(err => console.log(err.response));


}









