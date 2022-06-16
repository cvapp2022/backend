const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

// CVUserId:{type:mongoose.Schema.Types.ObjectId, ref: 'BLCVUser'},

const CvModel = new Schema({
    CVName: { type: String, required: true },
    CVUId: { type: mongoose.Schema.Types.ObjectId, ref: 'BLCVUser', required: true },
    CVTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'BLCVTemplate', required: true, },
    CVExp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVExp' }],
    CVEdu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVEdu' }],
    CVSkill: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVSkill' }],
    CVReff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVRef' }],
    CVContact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVContact' }],
    CVProj: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVProj' }],
    CVOrg: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVOrg' }],
    CVAw: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVAw' }],
    CvMeta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BLCVMeta' }],
    CvSections: {
        type: Object, default: [
            {
                name: 'experiences',
            },
            {
                name: 'educations',
            },
            {
                name: 'projects',
            },
        ]
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }

}, {
    timestamps: true
}
)

CvModel.virtual('CVImg', {
    ref: 'BLCVMeta',
    localField: '_id',
    foreignField: 'CVId',
    match: { MetaKey: 'profile-img' },
    justOne: true,
})
    .get(function (val) {

        if (val) {
            return val.MetaValue;
        }
        else {
            return null;
        }

    })

module.exports = mongoose.model('BLCV', CvModel);




