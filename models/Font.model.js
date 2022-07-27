const { Schema, model } = require("mongoose");



const fontSchema= new Schema(
    {
        nom: String,

        tipo:{ type: String, 
            default: 'font'
        },
        
        lat: {type:Number,
            required: true},
    
        lng: {type:Number,
            required: true},
    
        photo: [String],
        
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    }
    
    )

    const Font = model("Font", fontSchema, 'fonts');
    module.exports= Font