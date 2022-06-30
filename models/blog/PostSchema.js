const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

const BlogPost = new Schema({

    PostTitle: { type: String, required: true },
    PostStatus: { type: Number, default: 1 },
    PostState: { type: String, default: 'draft' }, // draft ,published
    PostCategory: {type:mongoose.Schema.Types.ObjectId, ref: 'BlogCategory'},
    PostChild:[{type:mongoose.Schema.Types.ObjectId, ref: 'BlogChildPost'}]
    
}, {
    timestamps: true
});



module.exports = mongoose.model('BlogPost', BlogPost);