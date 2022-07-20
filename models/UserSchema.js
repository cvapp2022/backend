const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs')
//Define a schema 
const Schema = mongoose.Schema;

const UserModel = new Schema({ 

    CVUserName: {type:String,min:8,required:true},
    CVFullName:{type:String,min:8,required:true},
    CVUserMail:{type:String,required:true},
    CVUserFrom:{type:String,required:true},
    CVUserStatus:{type:Number,default:0}, //Need Activation
    CVUserPlan:{type:Number,default:0}, // free Plan
    CVUCvId:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLCV'}],
    CVUClId:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLCL'}],
    MNRequests:[{type:mongoose.Schema.Types.ObjectId, ref: 'MnRequest'}],
    UserNotif:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLUserNotif'}],
    CVUserPass:{type:String,min:8,required:true} 
});
      
 
UserModel.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

UserModel.methods.validPassword = function(password) {
	
  return bcrypt.compareSync(password, this.CVUserPass);  
};
      
      
      
module.exports = mongoose.model('BLCVUser', UserModel);
//exports.model('BLCVUser',UserModel);