import { React } from "react"
import ListItem from '@mui/material/ListItem'
import { Typography } from '@mui/material'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    let { index, handleKeyPress } = props

    return (
        <ListItem
            id={'item-' + (index + 1)}
            key={'item-' + (index + 1)}
        >
            <Typography variant="h4"
                sx={{
                    backgroundColor: 'goldenrod',
                    width: '50px',
                    height: '45px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    verticalAlign: 'center',
                }}>{index + 1}.</Typography>
            <input type="text" defaultValue={props.text} onChange={handleKeyPress} style={{
                backgroundColor: 'goldenrod',
                marginLeft: '10px',
                height: '42px',
                borderRadius: '10px',
                paddingLeft: '5px',
                width: '100%'
            }} />
        </ListItem >
    )
}


export default Top5Item