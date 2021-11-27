import { Typography, ListItem } from '@mui/material'

function Comment(props) {
    const { comment, author } = props
    if (comment) {
        return (
            <ListItem
                sx={{
                    backgroundColor: "#D4AF37",
                    marginBottom: "10px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <Typography variant={'h6'} sx={{ color: "blue", textDecoration: "underline" }}>{author}</Typography>
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