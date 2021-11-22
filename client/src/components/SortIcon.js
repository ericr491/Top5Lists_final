import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import EditToolbar from './EditToolbar'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import SortSVGIcon from '@mui/icons-material/Sort'

export default function SortIcon() {
    const { store } = useContext(GlobalStoreContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const menuId = 'primary-search-account-menu'
    const sortByMenu = (
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
            <MenuItem onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Publish Date (Oldest)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Views</MenuItem>
            <MenuItem onClick={handleMenuClose}>Likes</MenuItem>
            <MenuItem onClick={handleMenuClose}>Dislikes</MenuItem>
        </Menu>
    )

    let menu = sortByMenu

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography>
                SORT BY
            </Typography>
            <SortSVGIcon
                size="large"
                edge="end"
                aria-label="select sort option"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
            </SortSVGIcon>
            {
                menu
            }
        </Box>
    )
}