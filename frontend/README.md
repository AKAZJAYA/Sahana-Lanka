# Sahana Lanka 🇱🇰

A mobile-first web application designed to help displaced people in Sri Lanka post their immediate needs during and after floods. The platform connects those affected by natural disasters with communities and organizations that can provide assistance.

## Tech Stack

- **Frontend**: React 19 with Vite, Tailwind CSS v4
- **Backend**: Node.js with Express 5
- **Database**: MongoDB with Mongoose
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sahana-lanka
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the [`backend`](backend) directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000` (or your specified PORT) with hot-reloading via nodemon.

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` with Vite's fast HMR.

### Building for Production

**Frontend**
```bash
cd frontend
npm run build
```

## Project Structure

```
sahana-lanka/
├── backend/              # Express.js API server
│   ├── package.json     # Backend dependencies
│   └── ...
│
└── frontend/            # React application
    ├── src/
    │   ├── App.jsx      # Main application component
    │   ├── main.jsx     # Application entry point
    │   └── assets/      # Images and static assets
    ├── public/          # Public static files
    ├── index.html       # HTML template
    ├── vite.config.js   # Vite configuration
    └── package.json     # Frontend dependencies
```

## Contributing

We welcome contributions! Feel free to submit issues and pull requests to help improve Sahana Lanka.

## License

ISC

---

Built with ❤️ to help communities in need