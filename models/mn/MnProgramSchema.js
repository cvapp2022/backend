const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const MnProgramModel = new Schema({ 
    ProgName:{type:String,required:true},
    ProgStatus:{type:Number,default:1},
    ProgDesc:{type:String,required:true},
    ProgImg:{type:String,default:process.env.PROGRAM_THUMBNAIL_DEFAULT},
    ProgMeetsNum:{type:Number,default:1},
    ProgFolder:{type:String,required:true},
    ProgPreparation:[{type: mongoose.Schema.Types.ObjectId, ref: 'MnProgramPrepartion'}],
    ProgMentors:[{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'}],
    //ProgMeets:[{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeet'}], 
})

// id 
// name
// desc
// img
// meets [many]
// mentors [many]

module.exports = mongoose.model('MnProgram', MnProgramModel);