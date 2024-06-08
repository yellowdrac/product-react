import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, Modal, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

const AddEditOrderPage = () => {
    const { id } = useParams();
    const isEdit = id !== 'new';
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openConfirmDeleteModal, setConfirmDelete] = useState(false);
    const [openConfirmSave, setOpenConfirmSave] = useState(false);
    const [productId, setProductId] = useState('');
    const [productLineId, setProductLineId] = useState('');
    const [qty, setQty] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [editProductIndex, setEditProductIndex] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                const response = await fetch('http://localhost:8060/api/products/getProducts',requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                const response = await fetch(`http://localhost:8060/api/orders/get/${id}`, requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }
                const data = await response.json();
                console.log("Data from order lines")
                console.log(data)
                setProducts(data.orderLines.map(line => ({
                    id: line.product.id,
                    idLine: line.id,
                    name: line.product.name,
                    unitPrice: line.unitPrice,
                    qty: line.quantity,
                    totalPrice: line.unitPrice * line.quantity
                })));
                setOrderNumber(data.orderID);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        if (isEdit && !isNaN(id)) {
            fetchOrder();
        }
    }, [id, isEdit]);
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setProductId('');
        setQty('');
        setProductLineId('');
        setOpen(false);
        setEditProductIndex(null);
    };

    const handleAddProduct = () => {
        const product = allProducts.find(p => p.id === parseInt(productId));
        if (product && qty > 0) {
            const updatedProducts = [...products];

            if (editProductIndex !== null) {
                // Editar producto existente en la línea específica
                console.log("Editando productos")
                console.log(productLineId)
                updatedProducts[editProductIndex] = {
                    ...product,
                    qty: parseInt(qty),
                    totalPrice: product.unitPrice * qty,
                    idLine: productLineId
                };
                console.log(updatedProducts)
                setProducts(updatedProducts);
                handleCloseEdit();
            } else {
                // Agregar nuevo producto
                updatedProducts.push({ ...product, qty: parseInt(qty), totalPrice: product.unitPrice * qty });
                setProducts(updatedProducts);
                handleClose();
            }
        }
    };

    const handleSaveOrder = async () => {
        try {
            const orderLines = products.map(product => ({
                product: { id: product.id },
                quantity: product.qty,
                unitPrice: product.unitPrice,
                name: product.name,
                ...(isEdit ? { id: product.idLine } : {}) // Agregar id solo si es una edición
            }));
            console.log({id});
            const orderData = {

                orderID: orderNumber, // Puedes generar un ID dinámicamente si es necesario
                date: new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD
                numberProducts: products.length,
                finalPrice: products.reduce((total, product) => total + product.totalPrice, 0),
                orderLines: orderLines,
                ...(isEdit ? { id} : {}) // Agregar id solo si es una edición
            };
            console.log(JSON.stringify(orderData))
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            };
            let response = ""
            if(isEdit){
                response = await fetch('http://localhost:8060/api/orders/update', requestOptions);
            }else{
                response = await fetch('http://localhost:8060/api/orders/create', requestOptions);
            }

            if (!response.ok) {
                throw new Error('Failed to save order');
            }
            navigate('/my-orders');

        } catch (error) {
            console.error('Error saving order:', error);
        }
    };
    const handleOrderNumberChange = (event) => {
        setOrderNumber(event.target.value);
    };

    const handleRemoveProduct = (index) => {
        const productToDelete = products[index];
        setSelectedProduct(productToDelete);
        setConfirmDelete(true);
        setEditProductIndex(index);
    };

    const handleOpneConfirmSave= () => {
        setOpenConfirmSave(true);
    };
    const handleCloseConfirmDeleteModal = () => setConfirmDelete(false);
    const handleCloseConfirmSave = () => setOpenConfirmSave(false);

    const handleConfirmDelete = () => {
        setProducts(products.filter((_, i) => i !== editProductIndex));
        setConfirmDelete(false);
        setSelectedProduct(null);
        setEditProductIndex(null);
    };

    const handleOpenEdit = (product, index) => {
        console.log("handleOpenEdit")
        console.log(product);
        setSelectedProductForEdit(product);
        setProductId(product.id);
        setProductLineId(product.idLine);
        setQty(product.qty);
        setEditProductIndex(index);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setProductId('');
        setProductLineId('');
        setQty('');
        setOpenEdit(false);
        setEditProductIndex(null);
    };
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                {isEdit ? 'Edit Order' : 'Add Order'}
            </Typography>
            <form>
                <TextField
                    label="Order #"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={orderNumber} // Asigna el valor de la variable de estado al TextField
                    onChange={handleOrderNumberChange} // Asigna la función de cambio
                />
                <TextField
                    label="Date"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={new Date().toLocaleDateString()}
                    disabled
                />
                <TextField
                    label="# Products"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={products.length}
                    disabled
                />
                <TextField
                    label="Final Price"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={`$${products.reduce((total, product) => total + product.totalPrice, 0).toFixed(2)}`}
                    disabled
                />
                <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleOpneConfirmSave}>
                        {isEdit ? 'Update Order' : 'Create Order'}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Add Product
                    </Button>
                </Box>
            </form>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-product-modal"
                aria-describedby="add-product-form"
            >
                <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                    <Typography variant="h6" id="add-product-modal">Add New Product</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="product-select-label">Product</InputLabel>
                        <Select
                            labelId="product-select-label"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            label="Product"
                        >
                            {allProducts.map(product => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Quantity"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleAddProduct}>
                            Add Product
                        </Button>
                    </Box>
                </Paper>
            </Modal>

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
                    </Box>                </Paper>
            </Modal>
            <Modal
                open={openConfirmSave}
                onClose={handleCloseConfirmSave}
                aria-labelledby="confirm-save-modal"
                aria-describedby="confirm-save-form"
            >
                <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                    <Typography variant="h6" id="confirm-save-modal">
                        Confirm Order
                    </Typography>
                    <Typography id="confirm-save-form">
                        Are you sure you want to save this order?
                    </Typography>
                    <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
                            Confirm
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseConfirmSave}>
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Modal>

            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="edit-product-modal"
                aria-describedby="edit-product-form"
            >
                <Paper sx={{ padding: 2, width: 300, margin: '100px auto' }}>
                    <Typography variant="h6" id="edit-product-modal">Edit Product</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="edit-product-select-label">Product</InputLabel>
                        <Select
                            labelId="edit-product-select-label"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            label="Product"
                        >
                            {allProducts.map(product => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Quantity"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleAddProduct}>
                            Update Product
                        </Button>
                    </Box>
                </Paper>
            </Modal>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Line ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product,index) => (
                            <TableRow key={product.id}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.unitPrice}</TableCell>
                                <TableCell>{product.qty}</TableCell>
                                <TableCell>{product.totalPrice.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: '#FFB74D', color: '#fff', marginRight: 1, '&:hover': { backgroundColor: '#FFA726' } }}
                                        onClick={() => handleOpenEdit(product, index)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveProduct(index)}
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default AddEditOrderPage;