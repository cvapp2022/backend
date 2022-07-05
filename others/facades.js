const ConatctModel = require('../models/cv/ContactSchema');
const CVMetaModel = require('../models/cv/CvMetaSchema');
const CvModel = require('../models/CvSchema');
const SkillModel = require('../models/cv/SkillSchema');
const UserModel = require('../models/UserSchema');
const MnMeetModel = require('../models/mn/MnMeetSchema')

const population=require('./populations')
const { google } = require('googleapis');
const stream = require('stream');


exports.saveCvMeta = function (arr, CvId) {

    arr.forEach(item => {


        var update = {
            MetaValue:item.value
        }

        CVMetaModel.findOneAndUpdate({ CVId: CvId, MetaKey: item.key }, update, function (err, result) {

            if (!err) {
                if (!result) {
                    var SaveCvMeta = new CVMetaModel();
                    SaveCvMeta.CVId = CvId;
                    SaveCvMeta.MetaKey = item.key;
                    SaveCvMeta.MetaValue = item.value;
                    SaveCvMeta.save(function (err, result) {

                        if (!err && result) {

                            exports.PushToCvArr(CvId, 'CvMeta', result._id);

                        }

                    });
                }
            }

        })


    })
}

exports.saveContact = function (arr, CvId) {


    arr.forEach(item => {
        //Save Contact
        var SaveContact = new ConatctModel();
        SaveContact.CVId = CvId;
        SaveContact.CKey = item.key;
        SaveContact.CValue = item.value;
        SaveContact.save(function (err) {
            console.log(err)
            if (!err) {
                //Push Contact To Contacts Arr
                CvModel.findOne({ _id: CvId }, function (err2, result) {
                    if (!err2) {
                        result.CVContact.push(SaveContact._id);
                        result.save();
                    }
                })
            }
        });
    });
}

exports.SaveSkill = function (arr, CvId) {



    arr.forEach(item => {


        //generate random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        //Save Skill
        var SaveSkill = new SkillModel();
        SaveSkill.CVId = CvId,
            SaveSkill.SkillTitle = item
        SaveSkill.SkillDesc = '   ';
        SaveSkill.SkillVal = 100;
        SaveSkill.SkillColor = color;
        SaveSkill.save(function (err, result) {
            if (!err) {
                //Push Skills To Skills Arr
                CvModel.findOne({ _id: CvId }, function (err2, result) {
                    if (!err2) {
                        result.CVSkill.push(SaveSkill._id);
                        result.save();
                    }
                })

            }

        })
    })
}

exports.PushToCvArr = function (CvId, arr, itemId) {

    //push item to Cv Arr
    CvModel.findOne({ _id: CvId }, function (err2, result2) {

        if (!err2 && result2) {
            result2[arr].push(itemId);
            result2.save();
        }
    })
}

exports.PullCvArr = function (CvId, arr, itemId) {

    CvModel.findOne({ _id: CvId }, function (err2, result2) {
        if (!err2 && result2) {
            // console.log(result2.CVEdu)
            result2[arr].pull(itemId)
            result2.save();
        }
    })
}


exports.CheckCv = function (CvId, UserId, callback) {


    CvModel.findOne({ _id: CvId, CVUId: UserId }, function (err2, result2) {

        if (!err2 && result2) {
            callback(result2)
        }
        else {
            callback(null)
        }
    })

}


exports.GetUser = function (UserId, pop, callback) {

    var popObj = population.UserPopulate;

    if (pop) {
        var populate = popObj;
    }
    else {
        var populate = null;
    }

    UserModel.findById(UserId).populate(populate).exec(function (err, result) {
        console.log(err)
        if (!err) {
            callback(result)
        }
        else {
            callback(null)
        }

    });

}


exports.googleAuth = function () {


    //client id
    const CLIENT_ID = '460388232750-4ppr2ilvejsqjbaj5qvulajkd62l8fpb.apps.googleusercontent.com'

    //client secret
    const CLIENT_SECRET = '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';

    const REFRESH_TOKEN = '1//04HlUviOjiDn3CgYIARAAGAQSNwF-L9IrGZN-bXUGMPiNikWRMZwb8Veb3HPvRVHij9S2bL17co5ymo9uB6hRN8MDchsd_ra7mrQ';

    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    //setting our auth credentials
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    return oauth2Client;


}


exports.uploadFileTo=async function(file,to,folderId,callback){

    
    let nfolder;
    let dfile;
    if(to === 'template'){
        nfolder=process.env.TEMPLATE_FOLDER;
        dfile=process.env.TEMPLATE_THUMBNAIL_DEFAULT;
    }
    else if(to === 'program'){
        nfolder=folderId;
        dfile=process.env.PROGRAM_THUMBNAIL_DEFAULT;
    }
    else if(to ==='post'){
        nfolder=folderId;
        dfile=process.env.POST_THUMBNAIL_DEFAULT
    }
    else if(to==='mentor'){
        nfolder=folderId;
        dfile=process.env.MENTOR_THUMBNAIL_DEFAULT
    }
    else if(to ==='session'){
        nfolder=folderId;
        dfile='';
    }

    var oauth2Client =exports.googleAuth();
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
    });


    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    try {

        drive.files.create({
            fields: 'id',
            resource:{
                'name':file.name,
                'parents':[nfolder],
            },
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
        }).then((resp)=>{

            //set permisions
            drive.permissions.create({
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                },
                fileId: resp.data.id
            }).then((resp2) => {
                callback(resp.data.id)
            }).catch((err2)=>{
                callback(dfile)
                console.log('setting permision',err2)
            });
        })
        .catch((err)=>{
            callback(dfile)
            console.log('error from saving file',err)
            callback(dfile)
        });

    } catch (error) {
        console.log(error)
    }
}

exports.createFolder=function(name,to,callback){

    let pfolder;
    if(to === 'posts'){
        pfolder=process.env.POST_FOLDER;
    }
    else if(to === 'programs'){
        pfolder=process.env.PROGRAM_FOLDER;
    }
    else if(to ==='mentors'){
        pfolder=process.env.MENTOR_FOLDER;
    }
    else if(to ==='session'){
        pfolder=process.env.SESSION_FOLDER;
    }
    var oauth2Client =exports.googleAuth();
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
    });

    try {
        drive.files.create({
            fields: 'id',
            resource:{
                'name':name,
                'parents':[pfolder],
                'mimeType': 'application/vnd.google-apps.folder',
            }
        }).then((resp)=>{
            callback(resp.data.id)
        })
    } catch (error) {
        throw   error;
    }
}