const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Font = require('../models/Font.model');
const Lavabo = require('../models/Lavabo.model')
const Axios = require('axios');
const Piscina = require('../models/piscina.model');


//  GET /api actualizes database maually
router.get('/get', (req, res, next) => {
	
Axios
.get('http://www.bcn.cat/tercerlloc/files/opendatabcn_lavabos.json')
.then((alldata)=>{
	const lavabosData= alldata.data;
	lavabosData.forEach((lavabo)=>{
		let {y, x } = lavabo.geo_epgs_4326
		const {neighborhood_name}= lavabo.addresses[0]

		Lavabo.findOne({lat:y, lng:x})
			.then((lavabo)=>{
				if(!lavabo){
			new Lavabo({lat:y, lng:x, nom:neighborhood_name}).save()
		}})
	})
	
	
	Axios
		.get('https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=0508ed3c-362b-4f1b-8980-bbdc06358155')
		.then((alldata)=>{
			const piscinaData= alldata.data.result.records
			piscinaData.forEach((piscina)=>{
				const {geo_epgs_4326_x, geo_epgs_4326_y, addresses_neighborhood_name} = piscina


				Piscina.findOne({lat:geo_epgs_4326_y, lng:geo_epgs_4326_x})
				.then((piscina)=>{
					if(!piscina){
						new Piscina ({lat:geo_epgs_4326_y, lng:geo_epgs_4326_x, nom:addresses_neighborhood_name}).save()
					}
				})				
			})
		})


	Axios
	.get('https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=32c82e7b-2471-4576-9941-b5044312e49f')
	.then((alldata)=>{
	
		const fontsData = alldata.data.result.records
		fontsData.forEach((font)=>{
			let {LATITUD, LONGITUD, NOM}= font

			Font.findOne({lat:LATITUD, lng:LONGITUD})
			.then((font)=>{
				if(!font){
					new Font({lat:LATITUD, lng:LONGITUD, nom: NOM}).save()
				}
			})
		 
		})

	})})
	res.redirect('/api')
});


router.get('/fonts', (req, res, next)=>{	//cojer info de la db i enviar al front
	Font.find()
	.populate({
		path:'comments',
			populate:{
					path:'user'
			}})
		
		.then((fonts)=>{
			res.json(fonts)
		})
		.catch((err)=>res.json(err))
})

router.get('/lavabos', (req, res, next)=>{ 	//cojer info de la db i enviar al front
	Lavabo.find()
	.populate({
		path:'comments',
			populate:{
					path:'user'
			}
		})
		.then((lavabos)=>{
			res.json(lavabos)
		})
		.catch((err)=>res.json(err))
})

router.get('/piscines', (req, res, next)=>{
	Piscina.find()
	.populate({
		path:'comments',
			populate:{
					path:'user'
			}
		})
		.then((piscines)=>{
			res.json(piscines)
		})
		.catch((err)=> res.json(err))
})


// //  GET /api/projects/:projectId -  Retrieves a specific project by id
// router.get('/lavafont/:lavafontId/:tipo', (req, res, next) => {
// 	const { lavafontId, tipo } = req.params;
	
// 	console.log(lavafontId)
// 	if (!mongoose.Types.ObjectId.isValid(lavafontId)) {
// 		res.status(400).json({ message: 'Specified id is not valid' });
// 		return;
// 	}
// 	if(tipo==='font'){
// 		Font.findById(lavafontId)
// 		.populate({
// 				path:'comments',
// 					populate:{
// 							path:'user'
// 					}
// 				})
			
// 		.then((font) => res.status(200).json(font))
// 		.catch((error) => res.json(error))
// 	}

	
// 	if(tipo==='piscina'){//Piscina.findById(lavafontId)
// 		Piscina.findById(lavafontId)
// 		.populate({
// 			path:'comments',
// 				populate:{
// 						path:'user'
// 				}
// 			})
// 		.then((project)=> {console.log('PIS'+project)
// 							res.status(200).json(project)
							
// 		})
// 		.catch((error)=>res.json(error))
// 	}

// 	else{
// 		Lavabo.findById(lavafontId)
// 		.populate({
// 			path:'comments',
// 				populate:{
// 						path:'user'
// 				}
// 			})
// 		.then((project) => { console.log('LAB'+project)
// 							res.status(200).json(project)})
// 		.catch((error) => res.json(error));
// 		}
// 	})





module.exports = router;
