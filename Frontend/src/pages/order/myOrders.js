import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Button, CircularProgress, Container, Grid, Modal, Paper, Typography, Chip} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { format } from 'date-fns-tz';
import LoadingSpinner from "../../components/loadingSpinner";


const adjustTimeZone = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() );


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
    const [loading, setLoading] = useState(true);
    const [openConfirmDeleteModal, setConfirmDelete] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const handleEdit = (params) => {
        console.log(params.id)
        navigate('/add-order/'+params.id);
    };
    const handleRemoveOrder = (params) => {


        setSelectedOrder(params)
        setConfirmDelete(true);
    };
    const [selectedOrder, setSelectedOrder] = useState(null);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                let color;
                switch (params.value) {
                    case 'Completed':
                        color = '#5BC403';
                        break;
                    case 'Pending':
                        color = '#E5DE06';
                        break;
                    case 'In Progress':
                        color = '#E59106';
                        break;
                    default:
                        color = 'default';
                        break;
                }
                return <Chip label={params.value} sx={{ backgroundColor: color, color: '#fff' }} />;
            },
        },
        {
            field: 'order',
            headerName: 'Order #',
            width: 150,
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
                                backgroundColor: '#FFA726',
                            },}}
                        onClick={() => handleEdit(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveOrder(params.row)}
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
                setLoading(true);
                // console.log("ResultAPI")
                const response = await fetch('http://localhost:8060/api/orders/getOrders');
                const data = await response.json();
                //console.log(data);
                const formattedData = data.map((order) => ({
                    id: order.id,
                    order: order.orderID,
                    date: adjustTimeZone(order.date),
                    status: order.status,
                    products: order.numberProducts,
                    finalPrice: order.finalPrice.toFixed(2)
                }));
                console.log("formattedData")
                setRows(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);
    const handleAddOrder = () => {
        navigate('/add-order/new');
    };
    const handleCloseConfirmDeleteModal = () => setConfirmDelete(false);
    const handleConfirmDelete = () => {
        fetch(`http://localhost:8060/api/orders/delete/${selectedOrder.id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete order');
                }

                console.log('Order deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting order:', error);

            })
            .finally(() => {
                setConfirmDelete(false);
            });
    };
    return (

        <Container maxWidth="xl" sx={{py:20}}>
            <Modal
                open={openConfirmDeleteModal}
                onClose={handleCloseConfirmDeleteModal}
                aria-labelledby="delete-product-line-modal"
                aria-describedby="delete-product-line-product-form"
            >
                <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                    <Typography variant="h6" id="confirm-delete-modal">
                        Confirm Deletion
                    </Typography>
                    <Typography id="confirm-delete-form">
                        Are you sure you want to delete {selectedOrder && selectedOrder.order}?
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
                            Confirm
                        </Button>
                    </Box>                </Paper>
            </Modal>
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
                    {loading ? (
                        <LoadingSpinner message="Loading..." />
                        ): (

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
                        )}


                </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default OrdersPage;
