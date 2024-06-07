import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, Modal, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { useState } from 'react';

const AddEditOrderPage = () => {
    const { id } = useParams();
    const isEdit = id !== 'new';
    const [open, setOpen] = useState(false);
    const [productId, setProductId] = useState('');
    const [qty, setQty] = useState('');
    const [products, setProducts] = useState([]);
    const [allProducts] = useState([
        { id: 1, name: 'Product 1', unitPrice: 10 },
        { id: 2, name: 'Product 2', unitPrice: 20 },
        { id: 3, name: 'Product 3', unitPrice: 30 }
    ]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setProductId('');
        setQty('');
        setOpen(false);
    };

    const handleAddProduct = () => {
        const product = allProducts.find(p => p.id === parseInt(productId));
        if (product && qty > 0) {
            setProducts([...products, { ...product, qty: parseInt(qty), totalPrice: product.unitPrice * qty }]);
            handleClose();
        }
    };

    const handleRemoveProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handleSaveOrder = () => {
        // Logic to save the order
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
                    value={`$${products.reduce((total, product) => total + product.totalPrice, 0)}`}
                    disabled
                />
                <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSaveOrder}>
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

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.unitPrice}</TableCell>
                                <TableCell>{product.qty}</TableCell>
                                <TableCell>{product.totalPrice}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: '#FFB74D', color: '#fff', marginRight: 1, '&:hover': { backgroundColor: '#FFA726' } }}
                                        onClick={() => handleOpen(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveProduct(product.id)}
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