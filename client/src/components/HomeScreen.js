import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import List from '@mui/material/List'
import AuthContext from '../auth'
import WorkspaceScreen from './WorkspaceScreen'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = (props) => {
    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext)
    const { delModalToggleVisibility, idNamePairs, toggleVisibility, displayMessage } = props

    // Redirects them to the ALL View if they are not logged in.
    useEffect(() => {
        if (!auth.loggedIn) {
            store.setActiveView("ALL")
        }
    }, [])

    if (!auth.loggedIn) {
        return <></>
    }

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
                                delModalToggleVisibility={delModalToggleVisibility}
                                toggleVisibility={toggleVisibility}
                                displayMessage={displayMessage}
                            />
                        ))
                }
            </List>
    }

    if (store.activeView === 'EDIT') {
        return (
            <div id="top5-list-selector">
                <WorkspaceScreen idNamePairs={idNamePairs} />
            </div>
        )
    } else {
        return (
            <div id="top5-list-selector">
                <div id="list-selector-list">
                    {
                        listCard
                    }
                </div>
            </div>
        )
    }

}

export default HomeScreen