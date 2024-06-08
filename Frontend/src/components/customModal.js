import React from 'react';
import { Modal, Paper, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const CustomModal = ({
                         open,
                         onClose,
                         title,
                         content,
                         buttons,
                         isForm = false, // Nuevo prop para determinar si es un formulario
                         formFields = {}, // Nuevo prop para los campos del formulario
                         formValues = {},
                         onFormChange,
                         onFormSubmit,
                     }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="custom-modal-title"
            aria-describedby="custom-modal-description"
        >
            <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                <Typography variant="h6" id="custom-modal-title">{title}</Typography>
                {isForm ? (
                    <Box component="form" sx={{ mt: 2 }}>
                        {formFields.select && (
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="custom-modal-select-label">{formFields.select.label}</InputLabel>
                                <Select
                                    labelId="custom-modal-select-label"
                                    value={formValues[formFields.select.name] || ''}
                                    onChange={(e) => onFormChange(formFields.select.name, e.target.value)}
                                    label={formFields.select.label}
                                >
                                    {formFields.select.options.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {formFields.textField && (
                            <TextField
                                label={formFields.textField.label}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type={formFields.textField.type || 'text'}
                                value={formValues[formFields.textField.name] || ''}
                                onChange={(e) => onFormChange(formFields.textField.name, e.target.value)}
                            />
                        )}
                    </Box>
                ) : (
                    <Typography id="custom-modal-description" sx={{ mt: 2 }}>
                        {content}
                    </Typography>
                )}
                <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            variant="contained"
                            color={button.color || 'primary'}
                            onClick={button.onClick}
                            sx={{ ml: 1 }}
                        >
                            {button.label}
                        </Button>
                    ))}
                </Box>
            </Paper>
        </Modal>
    );
};

export default CustomModal;