const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Font = require('../models/Font.model');
const Lavabo = require('../models/Lavabo.model')
const Axios = require('axios');
const Piscina = require('../models/piscina.model');


//  GET /api creates database
router.get('/get', (req, res, next) => {
	
Axios
.get('http://www.bcn.cat/tercerlloc/files/opendatabcn_lavabos.json')
.then((alldata)=>{
	Lavabo.deleteMany()
	const lavabosData= alldata.data;
	lavabosData.forEach((lavabo)=>{
		let {y, x } = lavabo.geo_epgs_4326
		
		const {neighborhood_name}= lavabo.addresses
		new Lavabo({lat:y, lng:x, nom:neighborhood_name}).save()
	})
	
	
	Axios
		.get('https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=0508ed3c-362b-4f1b-8980-bbdc06358155')
		.then((alldata)=>{
			const piscinaData= alldata.data.result.records
			piscinaData.forEach((piscina)=>{
				const {geo_epgs_4326_x, geo_epgs_4326_y, addresses_neighborhood_name} = piscina
				new Piscina ({lat:geo_epgs_4326_y, lng:geo_epgs_4326_x, nom:addresses_neighborhood_name}).save()
			})
		})


	Axios
	.get('https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=32c82e7b-2471-4576-9941-b5044312e49f')
	.then((alldata)=>{
		Font.deleteMany()
		const fontsData = alldata.data.result.records
		fontsData.forEach((font)=>{
			let {LATITUD, LONGITUD, NOM}= font
			new Font({lat:LATITUD, lng:LONGITUD, nom: NOM}).save()
			//.then(()=>{Font.find().populate('comments').then((allFonts) => res.json(allFonts)).catch((err) => res.json(err));}) (codi per a enviar al front font o lavabo 
		})

	})})
	res.redirect('/api')
});

router.get('/fonts', (req, res, next)=>{	//cojer info de la db i enviar al front
	Font.find()
		.then((fonts)=>{
			res.json(fonts)
		})
		.catch((err)=>res.json(err))
})

router.get('/lavabos', (req, res, next)=>{ 	//cojer info de la db i enviar al front
	Lavabo.find()
		.then((lavabos)=>{
			res.json(lavabos)
		})
		.catch((err)=>res.json(err))
})

router.get('/piscines', (req, res, next)=>{
	Piscina.find()
		.then((piscines)=>res.json(piscines))
		.catch((err)=> res.json(err))
})


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
