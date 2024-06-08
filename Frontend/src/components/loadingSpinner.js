import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: 'auto',
            mt: '10%',
            mb: '10%',
            width: '100%',
        }}
    >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 1 }}>
            {message || 'Loading...'}
        </Typography>
    </Box>
);

export default LoadingSpinner;