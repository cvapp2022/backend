const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')



const Schema = mongoose.Schema;

const MnMentorModel = new Schema({
    MentorName: { type: String, required: true },
    MentorDesc: { type: String, required: true },
    MentorMail: { type: String, required: true },
    MentorPhone: { type: String, required: true },
    MentorPass: { type: String, required: true },
    MentorStatus: { type: Number, default: 1 },
    MentorImg: { type: String,default:process.env.MENTOR_THUMBNAIL_DEFAULT },
    MentorFolder:{ type: String, required: true },
    MentorPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnProgram' }],
    MentorRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnRequest' }],
})

MnMentorModel.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

MnMentorModel.methods.validPassword = function (password) {

    return bcrypt.compareSync(password, this.MentorPass);
};

// id 
// name
// desc
// img
// meets [many]
// mentors [many]

module.exports = mongoose.model('MnMentor', MnMentorModel);







// id
// name
// phone
// mail
// meets [many]
// requests [many]