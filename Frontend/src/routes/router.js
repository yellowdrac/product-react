import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrdersPage from '../pages/order/myOrders';
import AddEditOrderPage from "../pages/order/addEditOrder";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/my-orders" element={<OrdersPage />} />
                {/* add / edit order */}
                <Route path="/add-order/:id" element={<AddEditOrderPage />} />

            </Routes>
        </Router>
    );
}