# Rider Frontend

A React-based web application for managing companies, drivers, and customers with real-time capabilities.

## Features

- **Company Management**: Create, edit, and delete company profiles
- **Driver Management**: Manage driver profiles including creation, editing, and deletion
- **Customer Management**: Handle customer profiles with full CRUD operations
- **Scheduling**: Manage driver schedules and assignments
- **Real-time Updates**: WebSocket integration for live data updates

## Technologies Used

### Frontend

- React
- React Router
- Zustand (state management)
- Tailwind CSS (styling)
- Lucide React (icons)
- Moment.js (date/time handling)
- JWT Decode (token decoding)

### Backend

- RESTful API (not included in this frontend repository)
- WebSocket integration

## Project Structure

src/
├── components/ # Reusable UI components
├── containers/ # Higher-level component wrappers
├── pages/ # Page-level route components
├── stores/ # Zustand state management
├── api/ # API endpoint definitions
└── utils/ # Utility functions

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/sohail-khan470/rider-frontend

   ```

2. **Install dependencies**

   bash/command-line
   npm install

3. **Start the development server**

   bash/command-line
   npm run dev
