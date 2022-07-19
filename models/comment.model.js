
const { Schema, model } = require("mongoose");



const comment= new Schema(
    {
        rating: Number,
        content: String,
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        labafont: {type: Schema.Types.ObjectId, ref: ['Font','Labavo']}

    },
    {
        timestamps: true
    }
    
    )


    const Comment = model("Comment", comment);
    module.exports= Comment