# 🏥 JadeWellness - Comprehensive Healthcare Platform

A modern, full-stack healthcare platform built with React, Node.js, and MongoDB, featuring pharmacy management, appointment booking, blood bank services, and AI-powered chatbot assistance.

## ✨ Features

### 🏥 **Core Healthcare Services**
- **Online Pharmacy**: Medicine search, prescription validation, and home delivery
- **Doctor Appointments**: Book, manage, and track medical appointments
- **Blood Bank**: Blood donation requests and donor management
- **AI Chatbot**: Intelligent healthcare assistance powered by Cohere AI

### 🔐 **Security & Authentication**
- **Two-Factor Authentication (2FA)**: QR code setup with backup codes
- **Secure Login**: JWT-based authentication with device tracking
- **Profile Management**: Complete user profile editing and data export
- **Password Security**: Secure password change functionality

### 💳 **Payment & Orders**
- **Stripe Integration**: Modern payment processing with Payment Intents API
- **Order Management**: Complete pharmacy order workflow
- **Cash on Delivery**: Alternative payment option
- **Email Notifications**: Order confirmations and updates

### 📧 **Communication System**
- **Email Service**: Brevo SMTP integration for all notifications
- **Real-time Notifications**: In-app notification system
- **Appointment Reminders**: Automated email confirmations
- **Order Updates**: Delivery and payment notifications

### 🎯 **Career Portal**
- **Job Applications**: Complete application system with file uploads
- **HR Notifications**: Automated email alerts for new applications
- **Position Listings**: Dynamic job posting system

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive design
- **React Query** for efficient data fetching and caching
- **React Router** for client-side routing
- **React Icons** for consistent iconography

### **Backend**
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for secure authentication
- **Stripe** for payment processing
- **Brevo SMTP** for email services
- **Cohere AI** for intelligent chatbot responses

### **Security & Performance**
- **Rate Limiting** to prevent abuse
- **CORS** configuration for secure cross-origin requests
- **Input Validation** on all forms and APIs
- **Database Indexing** for optimized queries
- **Lazy Loading** for improved performance

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JadeWellness
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5002
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   COHERE_API_KEY=your_cohere_api_key
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=your_brevo_email
   EMAIL_PASS=your_brevo_password
   FRONTEND_ORIGIN=http://localhost:5173
   ```

5. **Database Seeding**
   ```bash
   cd backend
   node scripts/seedMedicines.js
   node scripts/seedDoctors.js
   ```

6. **Start the Application**
   
   **Backend:**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5002

## 📁 **Project Structure**

```
JadeWellness/
├── backend/
│   ├── config/          # Database and environment configuration
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # MongoDB data models
│   ├── routes/          # API route definitions
│   ├── scripts/         # Database seeding scripts
│   ├── uploads/         # File upload storage
│   └── utils/           # Utility functions and services
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Main application pages
│   │   ├── assets/      # Images and static files
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Frontend utility functions
│   └── public/          # Static public assets
└── docs/                # Documentation files
```

## 🎨 **Key Components**

### **Pharmacy System**
- Medicine search with autocomplete
- Prescription validation
- Shopping cart functionality
- Order management with email notifications

### **Appointment Booking**
- Doctor availability checking
- Time slot management
- Email confirmations
- Appointment history tracking

### **Blood Bank**
- Blood type matching
- Donor registration
- Request management
- Emergency notifications

### **AI Chatbot**
- Healthcare-specific responses
- Fallback to rule-based system
- Context-aware assistance
- Integration with Cohere AI

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA

### **Pharmacy**
- `GET /api/medicines` - Get all medicines
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders

### **Appointments**
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Book appointment
- `PATCH /api/appointments/:id` - Update appointment

### **Blood Bank**
- `GET /api/blood` - Get blood requests
- `POST /api/blood` - Create blood request
- `POST /api/donors` - Register as donor

## 🚀 **Deployment**

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Email service configured
- [ ] Payment system tested
- [ ] AI service integrated
- [ ] Security measures enabled

### **Deployment Commands**
```bash
# Backend
cd backend
npm install --production
npm start

# Frontend
cd frontend
npm install
npm run build
npm run preview
```

## 📊 **Performance Metrics**
- **Loading Time**: < 2 seconds
- **API Response**: < 500ms
- **Database Queries**: Optimized with indexes
- **Bundle Size**: Optimized with code splitting

## 🔒 **Security Features**
- JWT-based authentication
- Two-factor authentication
- Rate limiting
- Input validation
- CORS protection
- Secure password hashing

## 📧 **Email Notifications**
- Welcome emails on registration
- Appointment confirmations
- Order status updates
- Blood donation notifications
- 2FA setup confirmations
- Job application alerts

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the deployment checklist

## 🎯 **Future Enhancements**
- Mobile app development
- Telemedicine features
- Advanced analytics dashboard
- Multi-language support
- Integration with more payment providers

---

**Built with ❤️ for better healthcare accessibility**
