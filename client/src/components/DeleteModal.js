import React, { useState, forwardRef, useImperativeHandle, useContext } from 'react'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import GlobalStoreContextProvider from '../store/index'

const DeleteModal = forwardRef((props, ref) => {
    const { store } = useContext(GlobalStoreContextProvider)
    const [isVisible, setVisibility] = useState(false)

    const toggleVisibility = () => {
        setVisibility(!isVisible)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }


    useImperativeHandle(ref, () => ({
        toggleVisibility,
    }))

    let message = ""
    if (store.listMarkedForDeletion) {
        message = 'Do you want to delete ' + store.listMarkedForDeletion.name + ' list?'
    }

    return (
        <div>
            <Modal
                open={isVisible}
                onClose={() => { setVisibility(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Alert severity="error" sx={{ fontSize: "20pt" }}>{message}</Alert>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            event.stopPropagation()
                            store.deleteMarkedList()
                            setVisibility(false)
                        }}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            event.stopPropagation()
                            store.unsetIsItemEditActive()
                            setVisibility(false)
                        }}
                        sx={{ mt: 3, mb: 2, float: "right" }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </div>
    )
})


export default DeleteModal