const { Schema, model } = require("mongoose");


const labavoSchema= new Schema(
{
    nom: String,
    
    lat: {type:Number,
        required: true},

    lng: {type:Number,
        required: true},

    photo: [String],

    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}

)

const Labavo = model("Labavo", labavoSchema);

module.exports= Labavo