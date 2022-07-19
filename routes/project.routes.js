const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Font = require('../models/Font.model');
const Lavabo = require('../models/Lavabo.model')



//  GET /api/projects -  Retrieves all of the projects
router.get('/map', (req, res, next) => {
	Font.find().populate('comments').then((allFonts) => res.json(allFonts)).catch((err) => res.json(err));
	Lavabo.find().populate('comments').then((allLavabos) => res.json(allLavabos)).catch((err) => res.json(err));

});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get('/lavafont/:lavafontId', (req, res, next) => {
	const { lavafontId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(lavafontId)) {
		res.status(400).json({ message: 'Specified id is not valid' });
		return;
	}

	// Each Project document has `tasks` array holding `_id`s of Task documents
	// We use .populate() method to get swap the `_id`s for the actual Task documents
	if(Font.findById(lavafontId)){
		Font.findById(lavafontId)
		.populate('comments')
		.then((project) => res.status(200).json(project))
		.catch((error) => res.json(error));}

	else{
		Lavabo.findById(lavafontId)
		.populate('comments')
		.then((project) => res.status(200).json(project))
		.catch((error) => res.json(error));
	}
});




module.exports = router;
