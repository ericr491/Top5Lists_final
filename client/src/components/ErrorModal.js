import React, { useState, forwardRef, useImperativeHandle } from 'react'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

const ErrorModal = forwardRef((props, ref) => {
    const [isVisible, setVisibility] = useState(false)
    const [message, setMessage] = useState('')

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
        setMessage,
    }))

    return (
        <div>
            <Modal
                open={isVisible}
                onClose={() => { setVisibility(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Alert severity="error">{message}</Alert>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            event.stopPropagation()
                            setVisibility(false)
                        }}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    )
})


export default ErrorModal