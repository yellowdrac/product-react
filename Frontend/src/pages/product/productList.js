import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Button, CircularProgress, Container, Grid, Modal, Paper, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { format } from 'date-fns-tz';


const adjustTimeZone = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + (5 * 60 * 60 * 1000));


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

const ProductsPage = () => {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openConfirmDeleteModal, setConfirmDelete] = useState(false);
    const [openConfirmSave, setOpenConfirmSave] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const handleClose = () => {
        setStock("")
        setUnitPrice("")
        setName("")
        setOpen(false);
    };
    const handleName = (event) => {
        setName(event.target.value);
    };
    const handleStock = (event) => {
        setStock(event.target.value);
    };
    const handleCloseConfirmSave = () => setOpenConfirmSave(false);

    const handleUnitPrice = (event) => {
        setUnitPrice(event.target.value);
    };
    const handleEdit = (params) => {
        console.log(params.id)
        setIsEdit(true);
        setStock(params.stock)
        setUnitPrice(params.unit_price)
        setName(params.name)
        setSelectedProduct(params)
        setOpen(true);

    };
    const handleRemoveOrder = (params) => {
        console.log("param  remove");
        console.log(params);
        setSelectedProduct(params)
        setConfirmDelete(true);
    };
    const [selectedOrder, setSelectedOrder] = useState(null);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
        },
        {
            field: 'unit_price',
            headerName: 'Unit Price',
            width: 250,
        },
        {
            field: 'stock',
            headerName: 'Stock',
            width: 210,
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
    const handleSaveProduct = async () => {
        try {

            const productData = {
                name,
                stock,
                unitPrice,
                ...(isEdit ? { id:selectedProduct.id} : {})
            };
            console.log(JSON.stringify(productData))
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            };
            let response = ""
            response = await fetch('http://localhost:8060/api/products/save', requestOptions);

            if (!response.ok) {
                throw new Error('Failed to save order');
            }
            navigate('/products');
            setOpenConfirmSave(false)
            setOpen(false)

            setStock("")
            setUnitPrice("")
            setName("")
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };
    useEffect(() => {

        const fetchOrders = async () => {
            try {
                setLoading(true);
                // console.log("ResultAPI")
                const response = await fetch('http://localhost:8060/api/products/getProducts');
                const data = await response.json();
                console.log(data);
                const formattedData = data.map((product) => ({
                    id: product.id,
                    name: product.name,
                    unit_price:  product.unitPrice.toFixed(2),
                    stock: product.stock
                }));
                //console.log("formattedData")
                console.log(formattedData)
                setRows(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchOrders();
    }, []);
    const handleAddProduct = () => {
        setIsEdit(false);
        setOpen(true)
    };
    const handleOpneConfirmSave= () => {
        setOpenConfirmSave(true);

    };
    const handleCloseConfirmDeleteModal = () => setConfirmDelete(false);
    const handleConfirmDelete = () => {
        fetch(`http://localhost:8060/api/products/delete/${selectedProduct.id}`, {
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
                        Are you sure you want to delete {selectedProduct && selectedProduct.name}?
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
                            Confirm
                        </Button>
                </Box>
                </Paper>
            </Modal>

            <Modal
                open={openConfirmSave}
                onClose={handleCloseConfirmSave}
                aria-labelledby="confirm-save-modal"
                aria-describedby="confirm-save-form"
            >
                <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                    <Typography variant="h6" id="confirm-save-modal">
                        Confirm Product
                    </Typography>
                    <Typography id="confirm-save-form">
                        Are you sure you want to create this product?
                    </Typography>
                    <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveProduct}>
                            Confirm
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseConfirmSave}>
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Modal>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-product-modal"
                aria-describedby="add-product-form"
            >
                <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    {isEdit ? 'Edit Product' : 'Add Product'}
                </Typography>
                <form>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={name}
                        onChange={handleName}
                    />
                    <TextField
                        label="Stock"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={stock}
                        onChange={handleStock}
                    />
                    <TextField
                        label="Unit Price"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={unitPrice}
                        onChange={handleUnitPrice}

                    />
                    <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleOpneConfirmSave}>
                            {isEdit ? 'Update Product' : 'Create Product'}
                        </Button>
                    </Box>
                </form>
                </Paper>
            </Modal>

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" sx={{ marginBottom: 2 }}>List of Available Products</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProduct}
                >
                    Add Product
                </Button>
            </Box>
            <Grid container spacing={3} sx={{py:10}}>
                <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{ height: 400, width: '100%' }}>
                        {loading ? (
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
                                    Loading...
                                </Typography>
                            </Box>
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

export default ProductsPage;
