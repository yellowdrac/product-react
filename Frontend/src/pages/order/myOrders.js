import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Button, Container, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { format } from 'date-fns';

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



const OrdersPage = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    useEffect(() => {

        const fetchOrders = async () => {
            try {
                console.log("ResultAPI")
                const response = await fetch('http://localhost:8060/api/orders/getOrders');
                const data = await response.json();
                console.log(data);
                const formattedData = data.map((order) => ({
                    id: order.id,
                    order: order.orderID,  // Cambia 'orderNumber' según el campo real en tu API
                    date: order.date,           // Asegúrate de que 'date' sea el nombre del campo en tu API
                    products: order.numberProducts,  // Asumiendo que 'products' es una lista en el objeto 'order'
                    finalPrice: order.finalPrice // Cambia 'finalPrice' según el campo real en tu API
                }));
                console.log("formattedData")
                console.log(formattedData)
                setRows(formattedData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);
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
