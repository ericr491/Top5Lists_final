const User = require('../models/user-model')
const Comment = require('../models/comment-model')
const Top5List = require('../models/top5list-model')

createTop5ListComment = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a comment',
        })
    }

    if (!req.userId) {
        return res.status(400).json({
            success: false,
            error: 'Unauthorized, please log in first.',
        })
    }

    const { top5ListId, comment } = body
    if (!top5ListId || !comment) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a comment',
        })
    }

    const existingUser = await User.findById({ _id: req.userId })
    if (existingUser) {
        const newComment = new Comment({ ownerEmail: existingUser.email, ownerName: existingUser.username, comment })
        Top5List.findById({ _id: top5ListId }, (err, top5List) => {
            if (err) {
                return res
                    .status(404)
                    .json({
                        err,
                        message: 'top5List not found',
                    })
            }

            console.log('list found')
            top5List.comments.push(newComment._id)
            top5List
                .save({ timestamps: false })
                .then(() => {
                    newComment
                        .save()
                        .then(() => {
                            return res.status(201).json({
                                success: true,
                                comment: comment,
                                message: 'Comment Created!'
                            })
                        })
                        .catch(error => {
                            return res.status(400).json({
                                error: error,
                                message: 'Comment Not Created!'
                            })
                        })
                })
        })
    } else {
        return res
            .status(404)
            .json({
                message: 'User not found',
            })
    }
}

module.exports = {
    createTop5ListComment
}