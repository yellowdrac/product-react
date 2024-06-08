import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Grid,
    Input,
    CircularProgress, Snackbar, Alert
} from '@mui/material';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "../../components/loadingSpinner";
import CustomModal from "../../components/customModal";


const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const AddEditOrderPage = () => {
    const { id } = useParams();
    const isEdit = id !== 'new';
    const [isCompleted, setIsCompleted] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openConfirmDeleteModal, setConfirmDelete] = useState(false);
    const [openConfirmSave, setOpenConfirmSave] = useState(false);
    const [productId, setProductId] = useState('');
    const [openValidationAlert, setOpenValidationAlert] = useState(false);
    const [productLineId, setProductLineId] = useState('');
    const [qty, setQty] = useState('');
    const [dateOrderTime, setOrderTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [orderNumber, setOrderNumber] = useState('');
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [status, setStatus] = useState('');
    const [noData, setNodata]=useState(false);
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
                setLoading(true)
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
                if(data.status==="Completed"){
                    setIsCompleted(true);
                }
                setOrderTime(data.date)
                setStatus(data.status)
                setProducts(data.orderLines.map(line => ({
                    id: line.product.id,
                    idLine: line.id,
                    name: line.product.name,
                    unitPrice: line.unitPrice,
                    qty: line.quantity,
                    totalPrice: line.unitPrice * line.quantity
                })));
                setOrderNumber(data.orderID);
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setNodata(true)
                console.error('Error fetching order:', error);
            }
        };

        if (isEdit && !isNaN(id)) {
            fetchOrder();
        }else {
            setLoading(false)
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
    const handleCloseValidationAlert = () => {
        setOpenValidationAlert(false);
    };
    const handleAddProduct = () => {
        const product = allProducts.find(p => p.id === parseInt(productId));
        if (product && qty > 0) {
            const updatedProducts = [...products];

            if (editProductIndex !== null) {

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
                ...(isEdit ? { id: product.idLine } : {})
            }));
            console.log(status);
            const orderData = {

                orderID: orderNumber,
                date: getUTCMinusFiveDate(),
                numberProducts: products.length,
                finalPrice: products.reduce((total, product) => total + product.totalPrice, 0),
                orderLines: orderLines,
                status: status,
                ...(isEdit ? { id} : {})
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
        if(status==="" ||orderNumber===""){
            setOpenValidationAlert(true);
        }else {
            setOpenConfirmSave(true);
        }

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
    const statusColor = {
        'Completed': '#5BC403',
        'Pending': '#E5DE06',
        'In Progress': '#E59106',
    };
    const handleCloseEdit = () => {
        setProductId('');
        setProductLineId('');
        setQty('');
        setOpenEdit(false);
        setEditProductIndex(null);
    };
    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };
    const getCurrentDateTime = () => {
        return new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };
    const handleFormChange = (field, value) => {
        switch (field) {
            case 'productId':
                setProductId(value);
                break;
            case 'qty':
                setQty(value);
                break;
            default:
                break;
        }
    };
    const getUTCMinusFiveDate = () => {
        const date = new Date();

        const utcMinusFiveDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        return utcMinusFiveDate.toISOString().slice(0, 19)
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Snackbar open={openValidationAlert} autoHideDuration={6000} onClose={handleCloseValidationAlert} anchorOrigin={{ vertical:"top", horizontal:"right" }}>
                <Alert onClose={handleCloseValidationAlert} severity="warning" sx={{ width: '100%' }}>
                    Status and Order Number are required!
                </Alert>
            </Snackbar>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                {isEdit ? 'Edit Order' : 'Add Order'}
            </Typography>
            {loading ? (
                <LoadingSpinner message="Loading..." />
            ): (
                noData? (
                        <Box>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            There is no information for this order
                        </Typography>
                </Box>

                    ) :(
                        <Box>
                            <form>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4} sm={4} md={4} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={status}
                                                disabled={isCompleted}
                                                onChange={handleChangeStatus}
                                                label="Status"
                                                sx={{height: "55px", marginTop: 1}}
                                                renderValue={() => (
                                                    <Chip
                                                        label={status}
                                                        style={{ backgroundColor: statusColor[status], color: 'white', fontWeight: 'bold', borderRadius: '4px' }}
                                                    />
                                                )}
                                            >
                                                {Object.keys(statusColor).map((key) => (
                                                    <MenuItem key={key} value={key}>
                                                        <Chip
                                                            label={key}
                                                            style={{ backgroundColor: statusColor[key], color: 'white', fontWeight: 'bold', borderRadius: '4px' }}
                                                        />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8}>
                                        <TextField
                                            label="Order #"
                                            fullWidth
                                            disabled={isCompleted}
                                            margin="normal"
                                            variant="outlined"
                                            value={orderNumber}
                                            onChange={handleOrderNumberChange}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={4} md={4}  >
                                        <TextField
                                            label="Date"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            value={isEdit ? formatDateTime(dateOrderTime)  : getCurrentDateTime()}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={4} md={4}  >
                                        <TextField
                                            label="# Products"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            value={products.length}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={4} md={4}  >
                                        <TextField
                                            label="Final Price"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            value={`$${products.reduce((total, product) => total + product.totalPrice, 0).toFixed(2)}`}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}  >
                                        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                                            <Button variant="contained" color="primary" onClick={handleOpneConfirmSave} disabled={isCompleted}>
                                                {isEdit ? 'Update Order' : 'Create Order'}
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={handleOpen} disabled={isCompleted}>
                                                Add Product
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>

                            <CustomModal
                                open={open}
                                onClose={() => setOpen(false)}
                                title="Add New Product"
                                isForm={true}
                                formFields={{
                                    select: {
                                        label: "Product",
                                        name: "productId",
                                        options: allProducts.map(product => ({
                                            value: product.id,
                                            label: product.name
                                        }))
                                    },
                                    textField: {
                                        label: "Quantity",
                                        name: "qty",
                                        type: "number"
                                    }
                                }}
                                formValues={{ productId, qty }}
                                onFormChange={handleFormChange}
                                buttons={[
                                    { label: 'Cancel', onClick: () => setOpen(false) },
                                    { label: 'Add Product', onClick: handleAddProduct, color: 'primary' },
                                ]}
                            />

                            <CustomModal
                                open={openConfirmDeleteModal}
                                onClose={handleCloseConfirmDeleteModal}
                                title="Confirm Delete"
                                content={`Are you sure you want to delete ${selectedProduct?.name}?`}
                                buttons={[
                                    { label: 'Cancel', onClick: handleCloseConfirmDeleteModal },
                                    { label: 'Delete', onClick: handleConfirmDelete, color: 'error' },
                                ]}
                            />
                            <CustomModal
                                open={openConfirmSave}
                                onClose={handleCloseConfirmSave}
                                title="Confirm Save"
                                content="Are you sure you want to save this order?"
                                buttons={[
                                    { label: 'Cancel', onClick: handleCloseConfirmSave },
                                    { label: 'Save', onClick: handleSaveOrder, color: 'primary' },
                                ]}
                            />
                            <CustomModal
                                open={openEdit}
                                onClose={() => setOpenEdit(false)}
                                title="Edit Product"
                                isForm={true}
                                formFields={{
                                    select: {
                                        label: "Product",
                                        name: "productId",
                                        options: allProducts.map(product => ({
                                            value: product.id,
                                            label: product.name
                                        }))
                                    },
                                    textField: {
                                        label: "Quantity",
                                        name: "qty",
                                        type: "number"
                                    }
                                }}
                                formValues={{ productId, qty }}
                                onFormChange={handleFormChange}
                                buttons={[
                                    { label: 'Cancel', onClick: () => setOpenEdit(false) },
                                    { label: 'Update Product', onClick: handleAddProduct, color: 'primary' },
                                ]}
                            />

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
                                                        disabled={isCompleted}
                                                        sx={{ backgroundColor: '#FFB74D', color: '#fff', marginRight: 1, '&:hover': { backgroundColor: '#FFA726' } }}
                                                        onClick={() => handleOpenEdit(product, index)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        disabled={isCompleted}
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
                        </Box>
                    )


            )}
        </Container>
    );
}

export default AddEditOrderPage;