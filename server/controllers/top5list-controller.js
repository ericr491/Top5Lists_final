const Top5List = require('../models/top5list-model')
const User = require('../models/user-model')

createTop5List = (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    if (!req.userId) {
        return res.status(400).json({
            success: false,
            error: 'Unauthorized, please log in first.',
        })
    }

    const top5List = new Top5List({ ...body, userId: req.userId })
    console.log("creating top5List: " + JSON.stringify(top5List))
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        if (err) {
            return res
                .status(404)
                .json({
                    err,
                    message: 'User not found',
                })
        }

        console.log("user found: " + JSON.stringify(user))
        user.top5Lists.push(top5List._id)
        user
            .save()
            .then(() => {
                top5List
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            success: true,
                            top5List: top5List,
                            message: 'Top 5 List Created!'
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            error: error,
                            message: 'Top 5 List Not Created!'
                        })
                    })
            })
    })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body))
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List))
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        if (!req.userId || (req.userId !== top5List.userId.toString())) {
            return res.status(401).json({
                success: false,
                message: 'User is not authorize to make changes.',
            })
        }

        top5List.name = body.name
        top5List.items = body.items
        top5List.published = body.published
        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!")
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error))
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        if (!req.userId || (req.userId !== top5List.userId.toString())) {
            return res.status(401).json({
                success: false,
                message: 'User is not authorize to make changes.',
            })
        }

        User.findById(req.userId, (err, user) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'User not found!',
                })
            }

            user.top5Lists = user.top5Lists.filter(mongoID => mongoID.toString() !== req.params.id)

            user.save(() => {
                console.log('LIST DELETED FROM USER')
                Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                    return res.status(200).json({ success: true, data: top5List })
                })
            })
        }).catch(err => console.log(err))
    })
}

getTop5ListById = async (req, res) => {
    await Top5List
        .findById({ _id: req.params.id })
        .populate('comments')
        .exec((err, list) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            console.log({ ...list._doc, items: list.items.slice(0, 5) })
            return res.status(200).json({ success: true, top5List: { ...list._doc, items: list.items.slice(0, 5) } })
        })
}

getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}
getTop5ListPairs = async (req, res) => {
    let queries = [{ published: true }]
    if (req.userId) {
        queries.push({ userId: req.userId })
    }
    await Top5List.find({ $or: queries }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists) {
            console.log("!top5Lists.length")
            return res
                .status(404)
                .json({ success: false, error: 'Top 5 Lists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = []
            for (let key in top5Lists) {
                let list = top5Lists[key]
                let pair = {
                    _id: list._id,
                    name: list.name,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    views: list.views,
                    published: list.published,
                    ownerName: list.ownerName,
                    publishedDate: list.updatedAt,
                    points: list.points.slice(0, 5),
                }
                pairs.push(pair)
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

// This allows users to update public info like views and likes
// Really should be a separate new route for likes/views that
// increments those values instead of updating the entire list but too lazy
updateUnimportantTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body))
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List
        .findOneAndUpdate(
            { _id: req.params.id },
            { likes: body.likes, dislikes: body.dislikes, views: body.views },
            { new: true, timestamps: false, useFindAndModify: false }
        )
        .exec((err, top5List) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            console.log("top5List found and updated: " + JSON.stringify(top5List))

            return res.status(200).json({
                success: true,
                id: top5List._id,
                message: 'Top 5 List updated!',
            })
        })
}

updateCommunityTop5List = async (req, res) => {
    const body = req.body
    const top5ListName = body.name
    const items = body.items

    if (!body || !top5ListName || !items) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const communityTop5List = await Top5List.findOne({
        name: new RegExp(`^${top5ListName}$`, 'i'), // list's names need to be case-insensitive 
        ownerName: { $exists: false }
    })

    if (communityTop5List) { // found
        let curItems = communityTop5List.items
        let curPoints = communityTop5List.points

        items.forEach((item, index) => {
            let i = curItems.findIndex(curItem => curItem.toLowerCase() === item.toLowerCase())
            if (i !== -1) {
                curPoints[i] += (5 - index)
            } else {
                curItems.push(item)
                curPoints.push(5 - index)
            }
        })

        let toBeSortedArray = curItems.map((item, index) => ({ itemName: item, points: curPoints[index] }))
        let sortedArray = toBeSortedArray.sort((objA, objB) => objB.points - objA.points)


        communityTop5List.items = sortedArray.map(obj => obj.itemName)
        communityTop5List.points = sortedArray.map(obj => obj.points)
        communityTop5List.markModified('points')
        communityTop5List.save()
            .then((savedTop5List) => {
                return res.status(201).json({
                    success: true,
                    top5List: savedTop5List,
                    message: 'Top 5 Community List Created!'
                })
            })
            .catch(error => {
                return res.status(400).json({
                    error: error,
                    message: 'Top 5 Community List Not Created!'
                })
            })
    } else { // not found
        let newCommunityTop5List = {
            ...body,
            points: [5, 4, 3, 2, 1],
            published: true,
            likes: [],
            dislikes: [],
            comments: [],
            views: 0,
        }

        delete newCommunityTop5List.userId
        delete newCommunityTop5List.ownerEmail
        delete newCommunityTop5List.ownerName

        console.log(newCommunityTop5List)
        let convertToDoc = new Top5List(newCommunityTop5List)
        convertToDoc
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    top5List: newCommunityTop5List,
                    message: 'Top 5 Community List Created!'
                })
            })
            .catch(error => {
                return res.status(400).json({
                    error: error,
                    message: 'Top 5 Community List Not Created!'
                })
            })
    }

}

deleteCommunityTop5List = async (req, res) => {
    const body = req.body
    const top5ListName = body.name
    const items = body.items

    if (!body || !top5ListName || !items) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const communityTop5List = await Top5List.findOne({
        name: new RegExp(`^${top5ListName}$`, 'i'), // list's names need to be case-insensitive 
        ownerName: { $exists: false }
    })

    if (communityTop5List) { // found
        let curItems = communityTop5List.items
        let curPoints = communityTop5List.points

        items.forEach((item, index) => {
            let i = curItems.findIndex(curItem => curItem.toLowerCase() === item.toLowerCase())
            if (i !== -1) {
                curPoints[i] -= (5 - index)
            }
        })

        let toBeSortedArray = curItems.map((item, index) => ({ itemName: item, points: curPoints[index] }))
        let sortedArray = toBeSortedArray.sort((objA, objB) => objB.points - objA.points).filter(obj => obj.points > 0)

        communityTop5List.items = sortedArray.map(obj => obj.itemName)
        communityTop5List.points = sortedArray.map(obj => obj.points)
        communityTop5List.markModified('points')
        communityTop5List.save()
            .then((savedTop5List) => {
                return res.status(201).json({
                    success: true,
                    top5List: savedTop5List,
                    message: 'Top 5 Community List Created!'
                })
            })
            .catch(error => {
                return res.status(400).json({
                    error: error,
                    message: 'Top 5 Community List Not Created!'
                })
            })
    } else {
        return res.status(400).json({
            success: false,
            message: 'Top 5 Community List Not Found!'
        })
    }
}

getCommunityTop5List = async (req, res) => {
    const body = req.body
    const listName = body.name

    const communityTop5List = await Top5List.findOne({
        name: new RegExp(`^${listName}$`, 'i'), // list's names need to be case-insensitive 
        ownerName: { $exists: false }
    })

    if (communityTop5List) {
        return res.status(200).json({
            success: true,
            top5List: communityTop5List,
            message: 'Top 5 Community List Found!'
        })
    } else {
        return res.status(400).json({
            success: false,
            message: 'Top 5 Community List Not Found!'
        })
    }
}

module.exports = {
    createTop5List,
    updateTop5List,
    updateUnimportantTop5List,
    updateCommunityTop5List,
    deleteCommunityTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById,
    getCommunityTop5List
}