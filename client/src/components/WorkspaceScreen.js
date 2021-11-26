import { useContext, useEffect, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List'
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import { TextField, Button } from '@mui/material'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen(props) {
    const { store } = useContext(GlobalStoreContext)
    const { idNamePairs } = props
    const [isVisible, setVisibility] = useState(false)
    const [title, setTitle] = useState(idNamePairs?.name || "")
    const [itemState, setItemState] = useState(['', '', '', '', ''])
    const [canSave, setCanSave] = useState(true)
    const [canPublish, setCanPublish] = useState(false)

    // Need to verify that the title is unique
    // const [userPublishedLists, setUserPublishedLists] = useState(idNamePairs.map(pair => pair.) || [])


    let publishedNames = idNamePairs?.filter(pair => pair.published).map(pair => pair.name) || []

    useEffect(() => {
        // when itemState is uploaded check if there are empty input fields
        if (title !== "" && itemState.every(numChars => numChars.length !== 0) && publishedNames.includes(title)) {
            setCanPublish(true)
        } else {
            setCanPublish(false)
        }
    }, [itemState])

    function handleOnChange(event) {
        setTitle(event.target.value)
    }

    async function handleSave(event) {
        await store.updateCurrentList()
    }

    function handleKeyPress(event, index) {
        let newState = [...itemState]
        newState[index] = event.target.value
        setItemState(newState)
    }

    let editItems = ""
    if (store.currentList) {
        editItems =
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
        <div id="top5-workspace">
            <TextField
                fullWidth
                value={title}
                onChange={handleOnChange}
                placeholder={"title"}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                sx={{ backgroundColor: "white", position: "absolute", top: '0', left: '0', zIndex: '100' }}
            />
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h5">1.</Typography></div>
                    <div className="item-number"><Typography variant="h5">2.</Typography></div>
                    <div className="item-number"><Typography variant="h5">3.</Typography></div>
                    <div className="item-number"><Typography variant="h5">4.</Typography></div>
                    <div className="item-number"><Typography variant="h5">5.</Typography></div>
                </div>
                {editItems}
            </div>
            <Button
                variant="contained"
                onClick={handleSave}
                sx={{ mt: 3, mb: 2 }}
                disabled={!canSave}
            >
                Save
            </Button>
            <Button
                variant="contained"
                onClick={(event) => {
                    event.stopPropagation()
                }}
                sx={{ mt: 3, mb: 2 }}
                disabled={!canPublish}
            >
                Publish
            </Button>
        </div>
    )
}

export default WorkspaceScreen