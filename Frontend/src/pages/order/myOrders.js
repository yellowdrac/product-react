import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Button, Container, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { format } from 'date-fns-tz';


const adjustTimeZone = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + (5 * 60 * 60 * 1000));

    // Formatear la fecha según el formato deseado
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const monthNamesShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthShort = monthNamesShort[adjustedDate.getUTCMonth()];
    const year = adjustedDate.getFullYear();
    const hours = String(adjustedDate.getHours()).padStart(2, '0');

    const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');
    const seconds = String(adjustedDate.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${day} ${monthShort} ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};




const OrdersPage = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const handleEdit = (params) => {
        console.log(params.id)
        navigate('/add-order/'+params.id);
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'order',
            headerName: 'Order #',
            width: 250,
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 250,
        },
        {
            field: 'products',
            headerName: '# Products',
            width: 210,
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
                        onClick={() => handleEdit(params.row)}
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
    useEffect(() => {

        const fetchOrders = async () => {
            try {
                // console.log("ResultAPI")
                const response = await fetch('http://localhost:8060/api/orders/getOrders');
                const data = await response.json();
                //console.log(data);
                const formattedData = data.map((order) => ({
                    id: order.id,
                    order: order.orderID,
                    date: adjustTimeZone(order.date),
                    products: order.numberProducts,
                    finalPrice: order.finalPrice.toFixed(2)
                }));
                //console.log("formattedData")
                //console.log(formattedData)
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
                <Grid item xs={12} sm={12} md={12}>
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
