# Antico - Antique Bidding Platform

A full-stack web application for antique bidding with role-based access control, built with Node.js, Express, React, and Supabase.

## 🚀 Features

### For Users
- Browse antique catalog
- Mark interest in products
- Participate in live bidding
- Real-time bid updates
- Responsive design

### For Admins
- Add new products
- View interest statistics
- Start/end bidding sessions
- View sold products with winners
- Comprehensive dashboard

## 🛠 Tech Stack

### Backend
- **Node.js** with ES Modules
- **Express.js** for REST API
- **Supabase** for database
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── biddingController.js
│   │   ├── interestController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bidding.js
│   │   ├── bids.js
│   │   ├── interests.js
│   │   └── products.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BidModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── CurrentBidding.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── supabase/
    └── migrations/
        └── create_antico_schema.sql
```

## 🗄️ Database Schema

### Tables
- **users**: User accounts with roles (user/admin)
- **products**: Antique products with status (listed/bidding/sold)
- **interests**: User interest tracking
- **bids**: Bidding records

## 🚀 Quick Start

### 1. Setup Supabase
1. Create a new Supabase project
2. Click "Connect to Supabase" button in the top right
3. Run the migration to create tables:
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the SQL from `supabase/migrations/create_antico_schema.sql`

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run seed  # Add admin user and sample products
npm start     # Start on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Start on port 3000
```

### 4. Environment Variables
Create `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## 👥 Demo Accounts

After running the seed script:

- **Admin**: `admin@antico.com` / `admin123`
- **User**: Create via registration or use demo login buttons

## 🔄 API Endpoints

### Authentication
- `POST /auth/signup` - Register user
- `POST /auth/login` - Login user/admin

### Products
- `GET /products` - List products (listed/bidding)
- `POST /products` - Add product (admin only)
- `GET /products/sold` - Sold products (admin only)
- `GET /products/:id/interests` - Interest count (admin only)

### Interests & Bidding
- `POST /interests` - Mark interest
- `POST /bidding/start` - Start bidding (admin only)
- `POST /bidding/end` - End bidding (admin only)
- `GET /bidding/current` - Current bidding product
- `POST /bids` - Place bid

## 🎨 Features

### User Experience
- **Real-time Updates**: Auto-refresh every 5 seconds during bidding
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-based Navigation**: Different interfaces for users and admins
- **Live Bidding Alerts**: Prominent notifications for active auctions
- **Interest Tracking**: Users can mark interest in products

### Admin Features
- **Product Management**: Add products with images and descriptions
- **Interest Analytics**: View how many users are interested in each product
- **Bidding Control**: Start and end auctions for products
- **Sales Dashboard**: View sold products with winning bids and winners

### Security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Separate permissions for users and admins
- **Row Level Security**: Database-level security with Supabase RLS
- **Password Hashing**: Secure password storage with bcrypt

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot reload enabled
```

## 📱 Usage Flow

### For Users:
1. Register/Login
2. Browse antique catalog
3. Mark interest in products
4. When admin starts bidding, participate in live auction
5. Place bids in real-time

### For Admins:
1. Login with admin account
2. Add new antique products
3. View interest statistics
4. Start bidding for products with high interest
5. Monitor live bidding
6. End bidding and view results

## 🚀 Deployment

The application is ready for deployment to platforms like:
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: Supabase (already cloud-hosted)

