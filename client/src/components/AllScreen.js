import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Typography } from '@mui/material'
import List from '@mui/material/List'
import AuthContext from '../auth'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const AllScreen = (props) => {
    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext)
    const { idNamePairs } = props

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

export default AllScreen