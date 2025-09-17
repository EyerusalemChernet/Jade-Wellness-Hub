# 🚀 Vercel Deployment Guide for JadeWellness

## 📋 **Environment Variables Setup**

### **Backend Environment Variables (for Vercel)**
You'll need to add these in your Vercel backend project settings:

```env
NODE_ENV=production
PORT=5002
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
COHERE_API_KEY=your_cohere_api_key
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your_brevo_email
EMAIL_PASS=your_brevo_password
FRONTEND_ORIGIN=https://your-frontend-app.vercel.app
```

### **Frontend Environment Variables (for Vercel)**
You'll need to add these in your Vercel frontend project settings:

```env
VITE_API_URL=https://your-backend-app.vercel.app
GENERATE_SOURCEMAP=false
```

## 🎯 **Deployment Steps**

### **Part 1: Deploy Backend**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Import from GitHub: `EyerusalemChernet/Jade-Wellness-Hub`

3. **Configure Backend**
   - **Project Name**: `jade-wellness-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Add all the backend environment variables listed above
   - Make sure to use your actual MongoDB Atlas connection string
   - Use your actual Stripe, Cohere, and Brevo credentials

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Save the deployment URL** (e.g., `https://jade-wellness-backend.vercel.app`)

### **Part 2: Deploy Frontend**

1. **Create New Project**
   - Click "Add New..." → "Project"
   - Import the same repository: `EyerusalemChernet/Jade-Wellness-Hub`

2. **Configure Frontend**
   - **Project Name**: `jade-wellness-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   - `VITE_API_URL`: Your backend Vercel URL (from Part 1)
   - `GENERATE_SOURCEMAP`: `false`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Save the frontend URL** (e.g., `https://jade-wellness-frontend.vercel.app`)

### **Part 3: Update Backend Environment**

1. **Update Backend Environment Variables**
   - Go back to your backend project in Vercel
   - Update `FRONTEND_ORIGIN` to your frontend Vercel URL
   - Redeploy the backend

## 🔧 **Important Notes**

### **Database Setup**
- Make sure your MongoDB Atlas cluster is accessible from anywhere (0.0.0.0/0)
- Use your MongoDB Atlas connection string in `MONGO_URI`

### **CORS Configuration**
- Your backend is already configured to accept requests from your frontend domain
- The `FRONTEND_ORIGIN` environment variable handles this

### **File Uploads**
- Vercel has limitations with file uploads
- Consider using cloud storage (AWS S3, Cloudinary) for production
- For now, the current setup will work for small files

### **Environment Variables Security**
- Never commit `.env` files to GitHub
- Use Vercel's environment variables section
- Keep your secrets secure

## 🎉 **After Deployment**

1. **Test Your Application**
   - Visit your frontend URL
   - Test user registration and login
   - Test pharmacy functionality
   - Test appointment booking

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor error logs
   - Test all major features

3. **Update Documentation**
   - Update your README with live URLs
   - Document any deployment-specific notes

## 🆘 **Troubleshooting**

### **Common Issues**
- **CORS Errors**: Make sure `FRONTEND_ORIGIN` is set correctly
- **Database Connection**: Verify MongoDB Atlas connection string
- **Environment Variables**: Double-check all variables are set
- **Build Errors**: Check Vercel build logs for specific errors

### **Support**
- Check Vercel documentation
- Review build logs in Vercel dashboard
- Test locally first before deploying

---

**Your JadeWellness platform will be live and accessible worldwide! 🌍**
