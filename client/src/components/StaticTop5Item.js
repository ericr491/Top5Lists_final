import { Typography, ListItem } from '@mui/material'

function StaticTop5Item(props) {
    const { index, content } = props
    if (content) {
        return (
            <ListItem
                component={"div"}
                style={{ color: "#D4AF37", }}
            >
                <Typography style={{ marginRight: "3px", fontWeight: "bold", fontSize: '15pt' }} component={'span'} >{index}.</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: '15pt' }} component={'span'} >
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