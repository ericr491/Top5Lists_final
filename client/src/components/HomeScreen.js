import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import List from '@mui/material/List'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = (props) => {
    const { store } = useContext(GlobalStoreContext)
    const { delModalToggleVisibility } = props

    useEffect(() => {
        store.loadIdNamePairs()
    }, [])

    function handleCreateNewList() {
        store.createNewList()
    }
    let listNameActive = false
    if (store && store.isListNameEditActive) {
        listNameActive = true
    }

    let listCard = ""
    if (store) {
        listCard =
            <List sx={{ width: '90%', left: '5%', bgcolor: '#E6E6E6' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                            delModalToggleVisibility={delModalToggleVisibility}
                        />
                    ))
                }
            </List>
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <Fab
                    color="primary"
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    disabled={listNameActive}
                >
                    <AddIcon />
                </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>)
}

export default HomeScreen