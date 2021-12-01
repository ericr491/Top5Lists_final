import { useContext, useState } from 'react'
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

    let currentSortBy = store.sortBy

    let borderStyle = {
        border: '1px black solid',
    }

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
            <MenuItem sx={currentSortBy === SortByType.NEW ? borderStyle : {}} onClick={() => { handleMenuItemClick(SortByType.NEW) }}>Publish Date (Newest)</MenuItem>
            <MenuItem sx={currentSortBy === SortByType.OLD ? borderStyle : {}} onClick={() => { handleMenuItemClick(SortByType.OLD) }}>Publish Date (Oldest)</MenuItem>
            <MenuItem sx={currentSortBy === SortByType.MOST_VIEWS ? borderStyle : {}} onClick={() => { handleMenuItemClick(SortByType.MOST_VIEWS) }}>Views</MenuItem>
            <MenuItem sx={currentSortBy === SortByType.MOST_LIKES ? borderStyle : {}} onClick={() => { handleMenuItemClick(SortByType.MOST_LIKES) }}>Likes</MenuItem>
            <MenuItem sx={currentSortBy === SortByType.MOST_DISLIKES ? borderStyle : {}} onClick={() => { handleMenuItemClick(SortByType.MOST_DISLIKES) }}>Dislikes</MenuItem>
        </Menu>
    )

    let menu = sortByMenu

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <Typography sx={{ color: "black", fontWeight: 'bold', mt: 1, mb: 1, fontSize: '13pt' }}>
                SORT BY
            </Typography>
            <SortSVGIcon
                edge="end"
                aria-label="select sort option"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                style={(disabled) ? { fill: 'gray', fontSize: '50pt' } : { fill: 'black', fontSize: '50pt' }}
            >
            </SortSVGIcon>
            {
                menu
            }
        </Box>
    )
}