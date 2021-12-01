import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import List from '@mui/material/List'
import StaticTop5Item from './StaticTop5Item'
import Comment from './Comment'
import Typography from '@mui/material/Typography'
import AuthContext from '../auth'
import api from '../api'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { idNamePair, delModalToggleVisibility, toggleVisibility, displayMessage } = props
    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext)
    const [editActive, setEditActive] = useState(false)
    const [text, setText] = useState("")
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)

    useEffect(() => {
        if (idNamePair?.likes.find(username => username === auth.user?.username)) {
            setLiked(true) // Means the user has liked this list
        } else {
            setLiked(false)
        }
        if (idNamePair?.dislikes.find(username => username === auth.user?.username)) {
            setDisliked(true)
        } else {
            setDisliked(false)
        }
    }, [idNamePair])

    async function handleToggleEdit(event) {
        event.stopPropagation()
        if (!editActive) {
            const fullList = await api.getTop5ListById(idNamePair._id)
            const newList = {
                ...fullList.data.top5List,
                views: fullList.data.top5List.views + 1
            }
            await store.updateViewsCount(newList._id, newList)
        }
        // else {
        //     await store.updateItemsAndComments(idNamePair._id)
        // }
        toggleEdit()
    }

    async function toggleEdit() {
        let newActive = !editActive
        setEditActive(newActive)
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation()
        await store.markListForDeletion(id)
        delModalToggleVisibility()
    }

    async function handleKeyPress(event) {
        if (event.code === "Enter") {
            await store.postAComment(idNamePair._id, text)
            setText("")
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value)
    }

    // When a user clicks the Edit Button it will open the Workplace
    function handleEditOnClick(event) {
        store.setCurrentList(idNamePair._id)
    }

    async function handleLike(event, id) {
        if (!auth.loggedIn) {
            displayMessage('You must be logged in to like/dislike')
            toggleVisibility()
            return
        }

        if (liked) { // Remove the user from the like list
            const fullList = await api.getTop5ListById(id)
            const newList = {
                ...fullList.data.top5List,
                likes: fullList.data.top5List.likes.filter(username => username !== auth.user.username)
            }
            await store.updateTop5List(id, newList)
        } else {
            const fullList = await api.getTop5ListById(id)
            const newList = {
                ...fullList.data.top5List,
                likes: fullList.data.top5List.likes.concat(auth.user.username),
                dislikes: fullList.data.top5List.dislikes.filter(username => username !== auth.user.username),
            }
            await store.updateTop5List(id, newList)
        }
    }

    async function handleDislike(event, id) {
        if (!auth.loggedIn) {
            displayMessage('You must be logged in to like/dislike')
            toggleVisibility()
            return
        }

        if (disliked) {
            const fullList = await api.getTop5ListById(id)
            const newList = {
                ...fullList.data.top5List,
                dislikes: fullList.data.top5List.dislikes.filter(username => username !== auth.user.username)
            }
            await store.updateTop5List(id, newList)
        } else {
            const fullList = await api.getTop5ListById(id)
            const newList = {
                ...fullList.data.top5List,
                dislikes: fullList.data.top5List.dislikes.concat(auth.user.username),
                likes: fullList.data.top5List.likes.filter(username => username !== auth.user.username),
            }
            await store.updateTop5List(id, newList)
        }
    }

    let publishedDate = (function () {
        let date = new Date(idNamePair.publishedDate).toDateString()
            .split(' ')
            .splice(1, 3)
            .join(' ')
        return (
            <Box
                style={{ color: "green" }}
            >
                <span style={{ color: 'black' }}>Published: </span>
                <span style={{ textDecoration: 'none' }}>{date}</span>
            </Box>
        )
    })()
    if (!idNamePair.published) {
        publishedDate = <Box style={{ color: "red" }} onClick={handleEditOnClick}>Edit</Box>
    }

    let items = undefined
    let comments = undefined
    let textField = undefined
    if (editActive) {
        const matchingList = store.idItemsComments
            .find(doc => doc._id === idNamePair._id)
        items = matchingList?.items.map((item, index) =>
            <StaticTop5Item
                key={`statictop5item${index + 1}`}
                index={index + 1}
                content={item}
                votes={store.activeView !== "COMMUNITY" ? undefined :
                    (idNamePair.points ? idNamePair.points[index] : undefined)} />
        )
        comments = matchingList?.comments.slice(0).reverse().map((comment, index) =>
            <Comment
                key={`top5comment${index + 1}`}
                author={comment.ownerName}
                comment={comment.comment}
            />
        )
        textField = <TextField
            margin="normal"
            id={"comment-" + idNamePair._id}
            name="name"
            autoComplete="Comment"
            placeholder="Add comment"
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            inputProps={{ style: { fontSize: 16, padding: 8 } }}
            sx={{ backgroundColor: "white", marginRight: 10, width: '95%' }}
            value={text}
            disabled={!auth.loggedIn}
        />
    }

    let likeButton = undefined
    let dislikeButton = undefined
    if (liked) {
        likeButton = <Typography component={'span'}>
            <ThumbUpIcon sx={{ fontSize: '30pt' }} onClick={(event) => handleLike(event, idNamePair._id)} />
            {idNamePair.likes.length}</Typography>
    } else {
        likeButton = <Typography component={'span'}>
            <ThumbUpOutlinedIcon sx={{ fontSize: '30pt' }} onClick={(event) => handleLike(event, idNamePair._id)} />
            {idNamePair.likes.length}</Typography>
    }
    if (disliked) {
        dislikeButton = <Typography component={'span'}>
            <ThumbDownIcon sx={{ fontSize: '30pt' }} onClick={(event) => handleDislike(event, idNamePair._id)} />
            {idNamePair.dislikes.length}</Typography>
    } else {
        dislikeButton = <Typography component={'span'}>
            <ThumbDownOutlinedIcon sx={{ fontSize: '30pt' }} onClick={(event) => handleDislike(event, idNamePair._id)} />
            {idNamePair.dislikes.length}</Typography>
    }

    let expandedViewElements = <Grid
        container
        item
        direction="row"
        md={12}
        columns={12}
        columnSpacing={2}
    >
        <Grid
            item
            md={6}
        >
            <Paper
                sx={{
                    backgroundColor: "#2C2F70",
                    width: "100%",
                    border: "2px solid black",
                    borderRadius: "10px",
                }}>
                {items && items.length > 0 ? <List>{items}</List> : <></>}
            </Paper>
        </Grid>

        <Grid
            item
            md={6}
        >
            <Paper
                sx={{ backgroundColor: "inherit", width: "100%" }}
                style={{ maxHeight: 200, overflow: 'auto' }}
                variant="none"
            >
                {comments && comments.length > 0
                    ? <List sx={{ mr: 2 }}>{comments}</List> : <></>}
            </Paper>
            {textField ? textField : <></>}
        </Grid>
    </Grid>

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={'listItem' + idNamePair._id}
            sx={{
                marginTop: '15px', display: 'flex', p: 1, paddingLeft: '15px',
                paddingRight: '0px', paddingTop: 0, paddingBottom: 0,
            }}
            style={{
                fontSize: '0pt',
                width: '100%',
                border: '1px solid black',
                borderRadius: '10px',
                backgroundColor: idNamePair.published ? '#D4D4F5' : '#FFFFF1'
            }}
        >
            <Grid
                container
                spacing={0}
                columns={12}
                direction={"row"}
            >
                <Grid
                    item
                    container
                    md={8}
                    direction="column"
                >
                    <Grid
                        item
                        md={3}
                        sx={{ p: 1, flexGrow: 1 }}
                    >
                        <Typography component={'span'} variant="h4" style={{
                            fontWeight: "bold"
                        }}>{idNamePair.name}</Typography>
                    </Grid>
                    <Grid
                        item
                        md={3}
                        sx={{ p: 1, flexGrow: 1 }}
                        style={{
                        }}
                    >
                        {store.activeView !== 'COMMUNITY' ?
                            (<Typography component={'span'} style={{ color: "blue" }}>
                                <span style={{ color: 'black' }}>By: </span>
                                <span style={{ textDecoration: 'underline' }}>{idNamePair.ownerName}</span>
                            </Typography>) :
                            (<Typography component={'span'} style={{ color: "blue" }}>
                                <span style={{ color: 'transparent' }}>&nbsp;</span>
                            </Typography>)
                        }
                    </Grid>
                    <Grid
                        item
                        md={3}
                        sx={{ p: 1, flexGrow: 1 }}
                        style={{
                        }}
                    >

                        {!editActive && <Typography component={'span'}>{publishedDate}</Typography>}
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    direction="column"
                    md={2}
                >
                    <Grid
                        item
                        sx={{ alignSelf: 'flex-end', flexGrow: 1, mr: 10, mt: 1 }}
                    >
                        {likeButton}
                    </Grid>
                    <Grid
                        item
                        md={3}
                        sx={{ p: 1, flexGrow: 1, mr: 10 }}
                        style={{
                            alignSelf: 'flex-end'
                        }}
                    >
                        {!editActive && (
                            <Typography
                                component={'span'}
                                style={{
                                    fontWeight: 'bold', fontSize: '12pt',
                                    color: 'red'
                                }}>
                                <span style={{ color: 'black' }}>Views:</span>
                                {idNamePair.views}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={1}
                    sx={{ mt: 1, flexGrow: 1 }}
                >
                    {dislikeButton}
                </Grid>

                <Grid
                    item
                    container
                    direction="column"
                    md={1}
                    sx={{ alignItems: 'flex-end' }}
                >
                    <Grid item sx={{ p: 0 }}>
                        {store.activeView === 'HOME' && (
                            <IconButton onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }} aria-label='delete'>
                                <DeleteIcon style={{ fontSize: '32pt' }} />
                            </IconButton>
                        )}
                    </Grid>
                    <Grid item sx={{ p: 0 }}>
                        {
                            !editActive && (
                                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                                    <ExpandMoreIcon style={{ fontSize: '32pt' }} />
                                </IconButton>
                            )
                        }

                    </Grid>
                </Grid>

                {editActive && expandedViewElements}

                <Grid
                    item
                    container
                    md={8}
                    direction="column"
                >
                    <Grid
                        sx={{ p: 1, flexGrow: 1 }}
                    >
                        {editActive && <Typography component={'span'}>{publishedDate}</Typography>}
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    direction="column"
                    md={2}
                >
                    <Grid
                        item
                        sx={{ p: 1, flexGrow: 1, mr: 10 }}
                        style={{
                            alignSelf: 'flex-end'
                        }}
                    >
                        {editActive && (
                            <Typography
                                component={'span'}
                                style={{
                                    fontWeight: 'bold', fontSize: '12pt',
                                    color: 'red'
                                }}>
                                <span style={{ color: 'black' }}>Views:</span>
                                {idNamePair.views}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={1}
                    sx={{ mt: 1, flexGrow: 1 }}
                >
                </Grid>

                <Grid
                    item
                    container
                    direction="column"
                    md={1}
                    sx={{ alignItems: 'flex-end' }}
                >
                    <Grid item sx={{ p: 0 }}>
                        {
                            editActive && (
                                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                                    <ExpandLessIcon style={{ fontSize: '32pt' }} />
                                </IconButton>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </ListItem>
    return (
        cardElement
    )
}

export default ListCard