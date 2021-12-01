import { useContext, useState } from 'react'
import { GlobalStoreContext, ActiveViewType } from '../store'
import AuthContext from '../auth'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SearchBar from './SearchBar'
import SortIcon from './SortIcon'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'


/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext)

    const [textField, setTextField] = useState("")

    let activeView = store.activeView
    let isEditMode = activeView === "EDIT"

    function handleUpdateText(event) {
        setTextField(event.target.value)
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.setSearchBarContents(textField)
        }
    }

    function handleClick(view) {
        if (store.activeView !== view) {
            store.setActiveView(view)
            setTextField("")
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0} style={{ backgroundColor: "#E0E0E0" }}>
                <Toolbar>
                    <Button
                        id='home-button'
                        onClick={() => handleClick(ActiveViewType.HOME)}
                        disabled={!auth.loggedIn || isEditMode}
                        variant={activeView === ActiveViewType.HOME ? "outlined" : "text"}
                        sx={{ ml: '1em', mr: '1em' }}
                    >
                        <HomeOutlinedIcon style={(!auth.loggedIn || isEditMode) ? { fontSize: '30pt' } : { fill: 'black', fontSize: '30pt' }} />
                    </Button>
                    <Button
                        id='all-button'
                        onClick={() => handleClick(ActiveViewType.ALL)}
                        disabled={isEditMode}
                        variant={activeView === ActiveViewType.ALL ? "outlined" : "text"}
                        sx={{ ml: '1em', mr: '1em' }}
                    >
                        <GroupOutlinedIcon style={(isEditMode) ? { fontSize: '30pt' } : { fill: 'black', fontSize: '30pt' }} />
                    </Button>
                    <Button
                        id='user-button'
                        onClick={() => handleClick(ActiveViewType.USER)}
                        disabled={isEditMode}
                        variant={activeView === ActiveViewType.USER ? "outlined" : "text"}
                        sx={{ ml: '1em', mr: '1em' }}
                    >
                        <PersonOutlinedIcon style={(isEditMode) ? { fontSize: '30pt' } : { fill: 'black', fontSize: '30pt' }} />
                    </Button>
                    <Button
                        id='community-button'
                        onClick={() => handleClick(ActiveViewType.COMMUNITY)}
                        disabled={isEditMode}
                        variant={activeView === ActiveViewType.COMMUNITY ? "outlined" : "text"}
                        sx={{
                            ml: '1em', mr: '1em',
                        }}
                    >
                        <div style={(isEditMode) ? { fontSize: 30, color: 'gray' } : { fontSize: 30, color: 'black' }}>
                            &#8721;
                        </div>
                    </Button>
                    <SearchBar
                        textField={textField}
                        handleKeyPress={handleKeyPress}
                        handleUpdateText={handleUpdateText}
                        disabled={isEditMode}
                    />
                    <SortIcon disabled={isEditMode} />

                </Toolbar>

            </AppBar>
        </Box>
    )
}

export default EditToolbar