const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

const BlogPost = new Schema({

    PostTitle: { type: String, required: true },
    PostDesc: { type: String, required: true },
    PostThumb:{ type: String, required: true },
    PostLang: { type: Number, required: true, default: 'en' },
    PostBody:{ type: String, required: true },
    PostParent:{type:mongoose.Schema.Types.ObjectId, ref: 'BlogPost'}
});



module.exports = mongoose.model('BlogChildPost', BlogPost);