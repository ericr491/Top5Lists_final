import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

export default function SplashScreen() {
    return (
        <div id="splash-screen" style={{ color: 'black', fontWeight: 'bold' }}>
            The Top 5 Lister
            <br />
            <Typography component={'span'} sx={{ fontWeight: 'bold', fontSize: 30 }}>
                Make your top 5 list, invite your friends and vote for the best list ever!
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box sx={{ padding: 0 }}>
                    <Link to='/login/'>
                        <Button variant="contained" sx={{ fontSize: 20, backgroundColor: '#D6D6D6' }}>
                            Login
                        </Button>
                    </Link>

                </Box>


                <Box>
                    <Link to='/home/'>
                        <Button variant="contained" sx={{ fontSize: 20, backgroundColor: '#D6D6D6' }}>
                            Continue as Guest
                        </Button>
                    </Link>
                </Box>


                <Box>
                    <Link to='/register/'>
                        <Button variant="contained" sx={{ fontSize: 20, backgroundColor: '#D6D6D6' }}>
                            Create Account
                        </Button>
                    </Link>
                </Box>
            </Box>

            <br />
            <br />
            <br />


            <Typography component={'span'}>
                Eric Ruan
            </Typography>

        </div>
    )
}