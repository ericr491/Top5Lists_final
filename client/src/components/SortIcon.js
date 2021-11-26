import { useContext, useState } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext, SortByType } from '../store'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import SortSVGIcon from '@mui/icons-material/Sort'

export default function SortIcon(props) {
    const { store } = useContext(GlobalStoreContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)
    const { disabled } = props

    const handleProfileMenuOpen = (event) => {
        if (!disabled)
            setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleMenuItemClick = (type) => {
        if (store.sortBy !== type) {
            store.setSortType(type)
        }
        handleMenuClose()
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
            <MenuItem onClick={() => { handleMenuItemClick(SortByType.NEW) }}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={() => { handleMenuItemClick(SortByType.OLD) }}>Publish Date (Oldest)</MenuItem>
            <MenuItem onClick={() => { handleMenuItemClick(SortByType.MOST_VIEWS) }}>Views</MenuItem>
            <MenuItem onClick={() => { handleMenuItemClick(SortByType.MOST_LIKES) }}>Likes</MenuItem>
            <MenuItem onClick={() => { handleMenuItemClick(SortByType.MOST_DISLIKES) }}>Dislikes</MenuItem>
        </Menu>
    )

    let menu = sortByMenu

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ color: "black" }}>
                SORT BY
            </Typography>
            <SortSVGIcon
                size="large"
                edge="end"
                aria-label="select sort option"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                style={{ fill: 'black' }}
            >
            </SortSVGIcon>
            {
                menu
            }
        </Box>
    )
}