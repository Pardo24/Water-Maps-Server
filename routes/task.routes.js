const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lavabo = require('../models/Lavabo.model');
const Font = require('../models/Font.model');
const Comment= require('../models/comment.model')

//  POST --  -  Creates a new comment
router.post('/lavafont/:lavafontId', (req, res, next) => {
	const { title, content, lavafontId } = req.body;
	const {user} = req.session.user

	Comment.create({ title, content, rating,  labafont: lavafontId, user: user._id })
		.then((newComment) => {
			if(Font.findById(lavafontId)){
			return Font.findByIdAndUpdate(lavafontId, {
				$push: { comments: newComment._id }
			});}
			else{
				return Lavabo.findByIdAndUpdate(lavafontId, {
					$push: { comments: newComment._id}
				})
			}
		})
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
});

// PUT  ---  - Updates a specific comment by id
router.put('/comments/:commentId', (req, res, next) => {
	const { commentId } = req.params;
	const { title, content, rating } = req.body;
	

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: 'Specified id is not valid' });
		return;
	}

	Comment.findByIdAndUpdate(
		commentId,
		{ title, content, rating },
		{ new: true }
	)
		.then(() => {
			res.send(req.body);
		})
		.catch((err) => res.json(err));
});

//  DELETE -- Deletes a specific task by id
router.delete('/comments/:commentId', (req, res, next) => {
	const { commentId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: 'Specified id is not valid' });
		return;
	}

	Comment.findByIdAndRemove(commentId)
		.then(() => res.json({ message: `Task with ${commentId} is removed successfully.` }))
		.catch((error) => res.json(error));
});

module.exports = router;
