var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Post = mongoose.model('Post');
//var Comment = require('../models/Comments.js');
//var Post = require('../models/Posts.js');

//mongoose.model('Comment');
//mongoose.model('Post');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Posts */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts){
		if(err){ return next(err); }

		res.json(posts);
	});
});

/* GET a single post by id */
router.get('/posts/:post', function(req, res) {
	req.post.populate('comments', function(err, post) {
		res.json(req.post);
	});
});

/* POST Posts */
router.post('/posts', function(req, res, next) {
	var post = new Post(req.body);

	post.save(function(err, post){
		if(err){ return next(err); }

		res.json(post);
	});
});

/* Load a post object */
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function (err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		req.post = post;
		return next();
	});
});

/* Load a comment object */
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment){
		if (err) { return next(err); }
		if (!comment) { return next(new Error("can't find comment")); }

		req.comment = comment;
		return next();
	});
});

/* Upvote a post */
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});

/* Upvote a comment */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment){
		if (err) { return next(err); }

		res.json(comment);
	})
})

/*POST a comment*/
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if(err){ return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err){ return next(err); }

			res.json(comment);
		});
	});
});

module.exports = router;
