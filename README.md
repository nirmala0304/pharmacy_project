# PharmaCare - Pharmacy Management System

PharmaCare is a modern web application designed for comprehensive pharmacy management. It features a customer-facing frontend for browsing medicines, placing orders, and uploading prescriptions, alongside a robust Pharmacist Admin panel to process orders, manage inventory, and review patient prescriptions securely.

## Project Structure

The project is split into two primary applications:
- **pharmacy-frontend-updated/**: A Vite + React application that provides the user interface (UI) for both customers and pharmacists.
- **pharmacy-backend-updated/**: A backend server (likely Node.js/Express or Spring Boot) that handles API requests, database operations, and file uploads.

## Key Features

### For Customers
- **Medicine Browsing & Inquiry:** Users can easily search for medicines, view availability, and request alternatives.
- **Prescription Upload:** Securely upload image or PDF prescriptions for pharmacist review.
- **Order Tracking:** Track the status of active orders (Pending, Processing, Shipped, Delivered).
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.

### For Pharmacists (Admin Panel)
- **Prescription Review:** Pharmacists can view, approve, or reject uploaded prescriptions.
- **Order Management:** Manage incoming orders and update delivery status.
- **Inventory Management:** Add new medicines, restock existing inventory, and manage prices.
- **Inquiry Handling:** Respond to patient inquiries about specific medicines.

## Technologies Used

- **Frontend:** React, Vite, Bootstrap, CSS Variables (Custom Design System)
- **Routing:** React Router DOM
- **HTTP Client:** Axios with Interceptors (for Authentication)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory: `cd pharmacy-frontend-updated/frontend-final`
2. Install dependencies: `npm install`
3. Create a `.env` file and set the API Base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Start the development server: `npm run dev`

## Recent Fixes
- **Mobile Responsiveness:** Fixed an issue where the main hero image and the mobile app mockup were hidden on smaller screens (`d-none`). They are now visible across all devices.
- **Admin Prescription Viewer:** Corrected the hardcoded `localhost:8080` URL in the Pharmacist Dashboard so that prescription images load properly from the remote backend environment using the configured `VITE_API_BASE_URL`.
