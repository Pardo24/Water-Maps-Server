
const { Schema, model } = require("mongoose");



const comment= new Schema(
    {
        rating: Number,
        title: String,
        content: String,
        photo: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        labafont: {type: Schema.Types.ObjectId, ref: 'Font'}

    },
    {
        timestamps: true
    }
    
    )


    const Comment = model("Comment", comment, 'comments');
    module.exports= Comment