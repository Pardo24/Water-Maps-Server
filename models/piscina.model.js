const { Schema, model } = require("mongoose");



const piscinaSchema= new Schema(
    {
        nom: String,
        
        tipo:{ type: String, 
            default: 'piscina'
        },
        
        lat: {type:Number,
            required: true},
    
        lng: {type:Number,
            required: true},
    
        photo: [String],
        
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    }
    
    )

    const Piscina = model("Piscina", piscinaSchema, 'piscinas');
    module.exports= Piscina