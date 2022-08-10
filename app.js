require("dotenv/config");
require("./db");
const express = require("express");
var cron = require('node-cron');
const Font = require('./models/Font.model');
const Lavabo = require('./models/Lavabo.model')
const Axios = require('axios');
const Piscina = require('./models/piscina.model');
const { isAuthenticated } = require("./middleware/jwt.middleware"); 


const app = express();
require("./config")(app);



const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);

const mapRoutes = require("./routes/map.routes");
app.use("/api", mapRoutes);            

const mapUserRoutes = require("./routes/mapuser.routes");
app.use("/api",isAuthenticated, mapUserRoutes);            





                    //actualizes database regularly every thursday at 02 am
cron.schedule('* * 2 * * 4', () => {
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
	})})
	
	
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
  })
});



module.exports = app;
