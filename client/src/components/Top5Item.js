import { React, useContext, useState, useRef } from "react"
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext)
    let { index, handleKeyPress } = props

    let itemClass = "top5-item"

    return (
        <ListItem
            id={'item-' + (index + 1)}
            key={'item-' + (index + 1)}
            className={itemClass}
        >
            {/* <TextField
                fullWidth
                onKeyPress={handleKeyPress}
                defaultValue={props.text}
                margin="normal"
                inputProps={{ style: { fontSize: 20 } }}
                InputLabelProps={{ style: { fontSize: 20 } }}
            /> */}
            <input type="text" defaultValue={props.text} onChange={handleKeyPress} />
        </ListItem >
    )
    // return (
    //     <ListItem
    //         id={'item-' + (index + 1)}
    //         key={'item-' + (index + 1)}
    //         className={itemClass}
    //         sx={{ display: 'flex', p: 1 }}
    //         style={{
    //             fontSize: '48pt',
    //             width: '100%'
    //         }}
    //     >
    //         <Box sx={{ p: 1 }}>
    //             <IconButton
    //                 aria-label='edit'
    //             >
    //                 <EditIcon style={{ fontSize: '48pt' }} />
    //             </IconButton>
    //         </Box>
    //         <Box sx={{ p: 1, flexGrow: 1 }}>{props.text}</Box>
    //     </ListItem>
    // )
}


export default Top5Item