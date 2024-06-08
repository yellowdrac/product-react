# Orders Management Application

This project is a simple React JS application for managing orders, with features to add, edit, and delete orders and their associated products. It consists of two main views: "My Orders" and "Add/Edit Order". The application is designed to demonstrate basic CRUD operations and routing in a React application.

## Features

### My Orders View

- **Route**: `/my-orders`
- **Title**: "My Orders"
- **Table**: Displays the list of orders with the following columns:
  - ID
  - Order #
  - Date
  - # Products
  - Final Price
  - Options
    - Edit Order: Redirects to the Add/Edit Order view, sending the ID.
    - Delete Order: Shows a confirmation modal and deletes the order.
- **Button**: Add a new order, redirects to the Add/Edit Order view.

### Add/Edit Order View

- **Route**: `/add-order/:id` (The `id` parameter is optional)
- **Title**: "Add Order" or "Edit Order" depending on the presence of an ID in the route params.
- **Form**: Allows creating or editing an order with the following fields:
  - Order #
  - Date (auto-completed with the current date, disabled)
  - # Products (auto-completed, disabled, count of selected products)
  - Final Price (auto-completed, disabled, sum of all product prices)
- **Button**: Add a new product to the order, which opens a modal with:
  - Select to choose the product
  - Input number for the quantity required
  - Button to confirm and save
- **Table**: Lists the products added to the order with the following columns:
  - ID
  - Name
  - Unit Price
  - Qty
  - Total Price
  - Options
    - Edit Product: Opens a modal to edit the product added to the order (not the general product info)
    - Remove Product: Shows a confirmation modal and removes the product from the order
- **Button**: Save and create the order

### Extra Features

1. **Products Management View**: Create a view to list, add, delete, and edit products.
2. **Change Order Status**: Add a new option in the table of orders to change the status of the order:
  - Pending
  - In Progress
  - Completed
3. **Validations**: Add validations to prevent editing or modifying completed orders.

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yellowdrac/product-react
   cd Frontend
   ```
2. Install dependencies::
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   git clone https://github.com/your-username/orders-management-app.git
   cd orders-management-app
   ```
