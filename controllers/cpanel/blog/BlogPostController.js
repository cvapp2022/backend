const { validationResult } = require('express-validator');
const CategorySchema = require('../../../models/blog/CategorySchema')
const PostSchema = require('../../../models/blog/PostSchema')
const PostChild = require('../../../models/blog/PostChild')
const population = require('../../../others/populations')

exports.SaveGet = function (req, res) {
    //fetch categories
    CategorySchema.find({}, function (err, result) {
        if (!err) {
            return res.render('cpanel/blog/posts/new', { cats: result })
        }
    })
}

exports.SavePost = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        res.redirect('/Cpanel/Blog/Post/new')
    }

    //save Post 
    var savePost = new PostSchema();
    savePost.PostTitle = req.body.postTitleI;
    savePost.PostState = 'published';
    savePost.PostCategory = req.body.postCategoryI;
    savePost.save(function (err, result) {
        if (!err && result) {
            console.log(result)
            return res.redirect('/Cpanel/Blog/Post/list')
        }
    })

}


exports.ListGet = function (req, res) {

    //fetch posts 
    PostSchema.find({ PostStatus: 1, PostState: 'published' }, function (err, result) {
        if (!err) {
            return res.render('cpanel/blog/posts/list', { posts: result })
        }
    }).populate(population.PostPopulate)


}

exports.SaveChildGet = function (req, res) {

    //validate params 
    var PostId = req.params.postId;
    var Lang = req.params.lang;

    //check post has no lang child 
    PostChild.find({ PostParent: PostId, PostLang: Lang }, function (err, result) {
        if (!err && result.length > 0) {
            res.redirect('/Cpanel/Blog/Post/new')
        }
        else {

            //fetcg blog 
            PostSchema.findById(PostId, function (err2, result2) {
                if (!err2 && result2) {
                    return res.render('cpanel/blog/postChild/new', { parent: result2 })
                }
            })


        }
    })


}

exports.SaveChildPost = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        res.redirect('/Cpanel/Blog/Post/new')
    }




}