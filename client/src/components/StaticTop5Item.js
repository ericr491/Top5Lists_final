import { Typography, ListItem } from '@mui/material'

function StaticTop5Item(props) {
    const { index, content } = props
    if (content) {
        return (
            <ListItem
                component={"div"}
                style={{ color: "#D4AF37", fontWeight: "bold" }}
            >
                <Typography style={{ marginRight: "3px" }} component={'span'} >{index}.</Typography>
                <Typography component={'span'} >
                    {content}
                </Typography>
            </ListItem>
        )
    } else {
        return (
            <></>
        )
    }
}

export default StaticTop5Item