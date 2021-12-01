import { Typography, ListItem, Box } from '@mui/material'

function StaticTop5Item(props) {
    const { index, content, votes } = props
    if (content) {
        return (
            <ListItem
                component={"div"}
                style={{ color: "#D4AF37", }}
            >
                <Box>
                    <Typography style={{ marginRight: "3px", fontWeight: "bold", fontSize: '15pt' }} component={'span'} >{index}.</Typography>
                    <Typography style={{ fontWeight: "bold", fontSize: '15pt' }} component={'span'} >
                        {content}
                    </Typography>
                    <Typography style={{ fontSize: '10pt' }}>
                        {votes !== undefined ? '(' + votes + ' Votes)' : ""}
                    </Typography>
                </Box>
            </ListItem>
        )
    } else {
        return (
            <></>
        )
    }
}

export default StaticTop5Item