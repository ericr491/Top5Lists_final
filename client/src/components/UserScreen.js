import React, { useContext } from 'react'
import ListCard from './ListCard.js'
import List from '@mui/material/List'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const UserScreen = (props) => {
    const { idNamePairs, delModalToggleVisibility, toggleVisibility, displayMessage } = props

    let listCard = ""
    if (idNamePairs) {
        listCard =
            <List sx={{ width: '90%', left: '5%', bgcolor: '#E6E6E6' }}>
                {
                    idNamePairs
                        .map((pair) => (
                            <ListCard
                                key={pair._id}
                                idNamePair={pair}
                                toggleVisibility={toggleVisibility}
                                displayMessage={displayMessage}
                                delModalToggleVisibility={delModalToggleVisibility}
                            />
                        ))
                }
            </List>
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>)
}

export default UserScreen