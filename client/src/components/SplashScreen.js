import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

export default function SplashScreen() {


    return (
        <div id="splash-screen" style={{ color: 'black' }}>
            The Top 5<br />
            Lister
            <br />
            <Typography component={'span'}>
                Make your top 5 list, invite your friends and vote for the best list ever!
            </Typography>

            <Box sx={{ padding: 0 }}>
                <Link to='/login/'>
                    <Button variant="contained">
                        Login
                    </Button>
                </Link>

            </Box>


            <Box>
                <Link to='/home/'>
                    <Button variant="contained">
                        Continue as Guest
                    </Button>
                </Link>
            </Box>


            <Box>
                <Link to='/register/'>
                    <Button variant="contained">
                        Create Account
                    </Button>
                </Link>
            </Box>

            <Typography component={'span'}>
                Eric Ruan
            </Typography>

        </div>
    )
}