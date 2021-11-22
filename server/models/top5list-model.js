const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        userId: { type: Schema.Types.ObjectId },
        ownerEmail: { type: String },
        ownerName: { type: String },
        likes: [{ type: Schema.Types.ObjectId, required: true }],
        dislikes: [{ type: Schema.Types.ObjectId, required: true }],
        views: { type: Schema.Types.Number, required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true }],
        published: { type: Boolean, required: true },
        // community: { type: Boolean, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
