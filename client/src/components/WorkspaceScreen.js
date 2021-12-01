import { useContext, useEffect, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List'
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import { TextField, Button, Box, Paper } from '@mui/material'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen(props) {
    const { store } = useContext(GlobalStoreContext)
    const { idNamePairs } = props
    const [title, setTitle] = useState("")
    const [itemState, setItemState] = useState(['', '', '', '', ''])
    const [canSave, setCanSave] = useState(true)
    const [canPublish, setCanPublish] = useState(false)

    // Need to verify that the title is unique
    // const [userPublishedLists, setUserPublishedLists] = useState(idNamePairs.map(pair => pair.) || [])


    useEffect(() => {
        if (store.currentList) {
            setItemState([...store.currentList.items])
            setTitle(store.currentList.name)
        }
    }, [store.currentList])

    useEffect(() => {
        // when itemState is uploaded check if there are empty input fields
        if (title !== "" && itemState.every(numChars => numChars.length !== 0)
            && itemState.length === (new Set(itemState)).size // no dupes!
            && !publishedNames.find(pubName => pubName.toLowerCase() === title.toLowerCase())) {
            setCanPublish(true)
        } else {
            setCanPublish(false)
        }
    }, [itemState, title])

    let publishedNames = idNamePairs?.filter(pair => pair.published).map(pair => pair.name) || []

    function handleOnChange(event) {
        setTitle(event.target.value)
    }

    async function handleSave(event) {
        await store.updateCurrentList(title, itemState)
    }

    async function handlePublished(event) {
        await store.updateCurrentList(title, itemState, true)
    }

    function handleKeyPress(event, index) {
        let newState = [...itemState]
        newState[index] = event.target.value
        setItemState(newState)
    }

    let editItems = ""
    if (store.currentList) {
        editItems =
            <List >
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item
                            key={'top5-item-' + (index + 1)}
                            text={item}
                            index={index}
                            handleKeyPress={(event) => handleKeyPress(event, index)}
                        />
                    ))
                }
            </List>
    } else {
        return <></>
    }
    return (
        // <div id="top5-workspace">
        <Box
            // id='list-selector-list'
            sx={{
                backgroundColor: '#D4D4F5',
                border: '2px black solid',
                borderRadius: '10px',
                width: "98%",
                height: "100%",
                margin: '1em',
                minHeight: '450px',
                display: "relative",
                fontWeight: 'bold',
            }}
        >

            <TextField
                value={title}
                onChange={handleOnChange}
                placeholder={"title"}
                inputProps={{ style: { fontSize: 16, padding: 1 } }}
                sx={{
                    backgroundColor: "white",
                    // zIndex: '100',
                    width: "50%",
                    marginTop: 1,
                    marginLeft: 2,
                }}
            />
            <Box
                sx={{
                    backgroundColor: '#123456',
                    width: '98%',
                    marginLeft: 2,
                    marginTop: 2,
                    borderRadius: '10px'
                }}
            >
                {editItems}
            </Box>
            {/* <div >
                    <div >
                        <div className="item-number"><Typography variant="h5">1.</Typography></div>
                        <div className="item-number"><Typography variant="h5">2.</Typography></div>
                        <div className="item-number"><Typography variant="h5">3.</Typography></div>
                        <div className="item-number"><Typography variant="h5">4.</Typography></div>
                        <div className="item-number"><Typography variant="h5">5.</Typography></div>
                    </div>
                    {editItems}
                </div> */}
            <Button
                variant="contained"
                onClick={handlePublished}
                sx={{
                    mt: 2, mb: 2,
                    float: 'right',
                    mr: 3,
                    backgroundColor: '#DDDDDD',
                    color: 'black',
                    borderRadius: '10px',
                    fontSize: '20px',
                    fontWeight: 'bold'
                }}
                disabled={!canPublish}
            >
                Publish
            </Button>
            <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                    mt: 2, mb: 2, mr: 3,
                    float: 'right',
                    backgroundColor: '#DDDDDD',
                    color: 'black',
                    borderRadius: '10px',
                    fontSize: '20px',
                    fontWeight: 'bold'
                }}
                disabled={!canSave}
            >
                Save
            </Button>
        </Box>

        /* </div> */
    )
}

export default WorkspaceScreen