import { useContext } from 'react'
import { GlobalStoreContext, ActiveViewType } from '../store'
import { Typography, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext)
    let text = ""
    let addButton = undefined

    const handleCreateNewList = () => {
        store.createNewList()
    }

    switch (store.activeView) {
        case ActiveViewType.HOME:
        case ActiveViewType.EDIT:
            text += "Your Lists"
            addButton = <Fab
                color="default"
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                disabled={store.activeView === ActiveViewType.EDIT}
            >
                <AddIcon />
            </Fab>
            break
        case ActiveViewType.ALL:
            if (store.searchBarContents) {
                text += store.searchBarContents
            }
            text += " Lists"
            break
        case ActiveViewType.USER:
            if (store.searchBarContents) {
                text += store.searchBarContents
            }
            text += " Lists"
            break

        case ActiveViewType.COMMUNITY:
            text = "Community Lists"
            break

        // case ActiveViewType.EDIT:
        //     break
        default:
            break
    }

    return (
        <div id="top5-statusbar">
            <Typography variant="h4">{text}{addButton && addButton}</Typography>
        </div>
    )
}

export default Statusbar