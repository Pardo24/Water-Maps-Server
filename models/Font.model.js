const { Schema, model } = require("mongoose");



const fontSchema= new Schema(
    {
        lat: {type:Number,
            required: true},
    
        lng: {type:Number,
            required: true},
    
        photo: [String],
        
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    }
    
    )

    const Font = model("Font", fontSchema);
    module.exports= Font