import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Button, Container, Grid, Typography} from "@mui/material";

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
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


const ClientsPage = () => {
    return (
        <Container maxWidth="xl" sx={{py:20}}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>My Orders</Typography>
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
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ClientsPage;
