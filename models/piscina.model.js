const { Schema, model } = require("mongoose");



const piscinaSchema= new Schema(
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

    const Piscina = model("Piscina", piscinaSchema);
    module.exports= Piscina