import { useState, useContext } from 'react'
import TextField from '@mui/material/TextField'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

function SearchBar(props) {
    const { textField, handleKeyPress, handleUpdateText } = props

    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext)

    const { disabled } = props

    return (
        <TextField
            margin="normal"
            fullWidth
            id={"searchBar"}
            name="search"
            autoComplete="Search"
            placeholder="Search"
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            inputProps={{ style: { fontSize: 16 } }}
            InputLabelProps={{ style: { fontSize: 12 } }}
            sx={{ backgroundColor: "white" }}
            value={textField}
            disabled={disabled}
        />
    )
}

export default SearchBar