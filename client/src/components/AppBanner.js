import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'

export default function AppBanner() {
    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        handleMenuClose()
        auth.logoutUser()
        store.closeCurrentList()
    }

    const menuId = 'primary-search-account-menu'
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/home/'>Continue As Guest</Link></MenuItem>
        </Menu>
    )
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let menu = loggedOutMenu
    if (auth.loggedIn) {
        menu = loggedInMenu
    }

    function getAccountMenu(loggedIn) {
        if (loggedIn) {
            return (
                <Box style={{ border: '2px black solid', backgroundColor: 'rgb(170, 43, 180)', borderRadius: '50%', height: '50px', width: '50px' }}>
                    <sub>{auth.user.firstName[0].toUpperCase() + auth.user.lastName[0].toUpperCase()}</sub>
                </Box>
            )
        } else {
            return <AccountCircle sx={{ fontSize: '30pt' }} />
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ backgroundColor: "#C4C4C4" }}>
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <Link style={{ textDecoration: 'none', color: '#D3AC28' }} to='/home/'>T<sup>5</sup>L</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                        <IconButton
                            size="medium"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="default"
                        >
                            {getAccountMenu(auth.loggedIn)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    )
}