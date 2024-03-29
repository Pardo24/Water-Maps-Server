const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lavabo = require('../models/Lavabo.model');
const Font = require('../models/Font.model');
const Comment= require('../models/comment.model');
const Piscina = require('../models/piscina.model');

//  POST --  -  Creates a new comment
router.post('/lavafont/:lavafontId', (req, res, next) => {
	const { title, content, rating, photo, labafont, user } = req.body;
	const {lavafontId} = req.params

	Comment.create({ title, content, rating, photo, labafont, user }) 
		.then((newComment) => {
					
				Lavabo.findById(lavafontId)

				.then((responseF)=>{
					if(responseF){
						 Lavabo.findByIdAndUpdate(lavafontId, 
							{$push: { comments: newComment.id } } )
							
							.then((response) =>{
								
								return res.json(response)
								})}	

					else{
					 if(Piscina.findById(labafont)!==undefined){
						 Piscina.findByIdAndUpdate(labafont,
							{$push: {comments: newComment.id } })

							.then((response) =>{if(response)return res.json(response)
												})}


					else if(Font.findById(labafont)){
						 Font.findByIdAndUpdate(labafont, {
						$push: { comments: newComment.id}})

				.then((response) =>{ return res.json(response)})
				}}

				})
			
			.catch((err) => res.json(err));

		})});

// PUT  ---  - Updates a specific comment by id
router.put('/comments/:commentId', (req, res, next) => {
	const { commentId } = req.params;
	const { title, content, rating, photo } = req.body;
	

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		res.status(400).json({ message: 'Specified id is not valid' });
		return;
	}

	Comment.findByIdAndUpdate(
		commentId,
		{ title, content, rating, photo },
		{ new: true }
	)
		.then(() => {
			res.send(req.body);
		})
		.catch((err) => res.json(err));
});

//  DELETE -- Deletes a specific comment by id
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
