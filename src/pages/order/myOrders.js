import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Button, Container, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'order',
        headerName: 'Order #',
        width: 250,
        editable: true,
    },
    {
        field: 'date',
        headerName: 'Date',
        width: 250,
        editable: true,
    },
    {
        field: 'products',
        headerName: '# Products',
        width: 210,
        editable: true,
    },
    {
        field: 'finalPrice',
        headerName: 'Final Price',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 260,
    },

    {
        field: 'options',
        headerName: 'Options',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 260,
        renderCell: (params) => (
            <div>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: '#FFB74D', color: '#fff', marginRight: 1 ,
                        '&:hover': {
                            backgroundColor: '#FFA726', // más oscuro al hacer hover
                        },}}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                >
                    Delete
                </Button>
            </div>
        ),
    },
];

const rows = [
    { id: 1, order: '00009100', date: '27/02/2024', products:1,finalPrice: 14 },
    { id: 2, order: '00009101', date: '17/02/2024',products:2, finalPrice: 31 },
    { id: 3, order: '00009102', date: '15/03/2024', products:3,finalPrice: 31 },
    { id: 4, order: '00009103', date: '18/03/2024', products:3,finalPrice: 11 },
    { id: 5, order: '00009104', date: '22/03/2024', products:5,finalPrice: 98.76 },
    { id: 6, order: '00009105', date: '25/03/2024', products:1,finalPrice: 150 },
    { id: 7, order: '00009106', date: '31/04/2024', products:7,finalPrice: 44 },
    { id: 8, order: '00009107', date: '27/05/2024', products:10,finalPrice: 36 },
    { id: 9, order: '00009108', date: '28/05/2024', products:15,finalPrice: 65 },
];


const OrdersPage = () => {
    const navigate = useNavigate();

    const handleAddOrder = () => {
        navigate('/add-order/new');
    };

    return (
        <Container maxWidth="xl" sx={{py:20}}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" sx={{ marginBottom: 2 }}>My Orders</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddOrder}
                >
                    Add Order
                </Button>
            </Box>
            <Grid container spacing={3} sx={{py:10}}>
                <Grid xs={12} sm={12} md={12}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[3,5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default OrdersPage;
