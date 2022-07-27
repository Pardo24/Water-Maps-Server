const { Schema, model } = require("mongoose");


const labavoSchema= new Schema(
{
    nom: String,
    tipo:{ type: String, 
        default: 'lavabo'
    },
    
    lat: {type:Number,
        required: true},

    lng: {type:Number,
        required: true},

    photo: [String],

    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}

)

const Labavo = model("Labavo", labavoSchema, 'labavos');

module.exports= Labavo