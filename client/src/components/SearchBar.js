import TextField from '@mui/material/TextField'

function SearchBar(props) {
    const { textField, handleKeyPress, handleUpdateText } = props

    const { disabled } = props

    return (
        <TextField
            margin="normal"
            id={"searchBar"}
            name="search"
            autoComplete="Search"
            placeholder="Search"
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            inputProps={{ style: { fontSize: 16 } }}
            InputLabelProps={{ style: { fontSize: 12 } }}
            sx={{ backgroundColor: "white", mr: 2, ml: 2, width: "57%" }}
            value={textField}
            disabled={disabled}
        />
    )
}

export default SearchBar