const express = require('express');
const queryString =require('query-string')
const router = express.Router();



//authenticate using facebook
router.get('/init',function(req,res){

    //perpare google auth link
    const googlestringifiedParams = queryString.stringify({
        client_id:process.env.GOOGLE_CLI_ID,
        redirect_uri: process.env.GOOGLE_CLI_REDIRECT_URL,
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space seperated string
        response_type: 'code',
    });

    //prepare github link
    const githubstringifiedParams = queryString.stringify({
      client_id: process.env.GITHUB_CLI_ID,
      redirect_uri: process.env.GITHUB_CLI_REDIRECT_URL,
      scope: ['user'].join(' '), // space seperated string
      allow_signup: true,
    });
    
    //prepare linkedin link
    const linkedinstringifiedParams = queryString.stringify({
      client_id: process.env.LINKEDIN_CLI_ID,
      redirect_uri: process.env.LINKEDIN_CLI_REDIRECT_URL,
      scope: [
        'r_emailaddress',
      ].join(' '), // space seperated string
      response_type: 'code',

    });
    
    //prepare facebook login link



    
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googlestringifiedParams}`;
    const githubLoginUrl = `https://github.com/login/oauth/authorize?${githubstringifiedParams}`;
    const linkedinLoginUrl= `https://www.linkedin.com/oauth/v2/authorization?${linkedinstringifiedParams}`;
    var data = {
      'google':googleLoginUrl,
      'github':githubLoginUrl,
      'linkedin':linkedinLoginUrl
    }
    return res.json({
      success:true,
      payload:{LoginLinks:data,configs:{}},
      message:'App init Successfuly loaded'
  })
    





})







module.exports = router;