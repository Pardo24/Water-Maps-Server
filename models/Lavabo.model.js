const { Schema, model } = require("mongoose");


const labavoSchema= new Schema(
{
    lat: {type:Number,
        required: true},

    lng: {type:Number,
        required: true},

    photo: [String],

    ratings: [Number],

    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}

)

const Labavo = model("Labavo", labavoSchema);

module.exports= Labavo