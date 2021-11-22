import { Typography, ListItem } from '@mui/material'

function Comment(props) {
    const { comment, author } = props
    if (comment) {
        return (
            <ListItem
                sx={{
                    backgroundColor: "#D4AF37",
                    marginTop: "10px",
                    marginBottom: "10px",
                    border: "1px solid black",
                    borderRadius: "10px",
                }}
            >
                <Typography component={'span'} sx={{ color: "blue" }}>{author}</Typography>
                <Typography component={'span'} >
                    {comment}
                </Typography>
            </ListItem>
        )
    } else {
        return (
            <></>
        )
    }
}

export default Comment