# Render Deployment Guide for IN&OUT Backend

## Prerequisites
- MongoDB Atlas account (or MongoDB connection URI)
- Razorpay account with API keys
- GitHub account
- Render account

## Deployment Steps

### 1. Prepare Git Repository
The server folder needs to be in a Git repository. You have two options:

**Option A: Use the existing repository**
- The server folder is already part of your main project repository
- You'll deploy from the `/In-out/server` subdirectory

**Option B: Create a separate repository for the server**
```bash
cd server
git init
git add .
git commit -m "Initial commit - IN&OUT backend"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `in-out-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `In-out/server` (if using main repo) or leave empty (if separate repo)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

In Render dashboard, add these environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `<random-secure-string>` | Generate a secure random string |
| `RAZORPAY_KEY_ID` | `rzp_live_...` or `rzp_test_...` | Your Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | `<your-secret>` | Your Razorpay Key Secret |
| `PORT` | `4000` | Port number (Render will override this) |
| `NODE_ENV` | `production` | Environment mode |

**Important**: 
- Use MongoDB Atlas (cloud) instead of local MongoDB
- Generate a strong JWT_SECRET (e.g., using `openssl rand -base64 32`)
- Use production Razorpay keys for live deployment

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete (check logs)
4. Your backend URL will be: `https://in-out-backend.onrender.com` (or your chosen name)

### 5. Update Frontend Configuration

After deployment, update your Vercel frontend environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
3. Redeploy your frontend

### 6. Test the Deployment

Test these endpoints:
- `GET https://your-backend-url.onrender.com/` - Should return "In-out API is running"
- `GET https://your-backend-url.onrender.com/rooms` - Should return room list

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Check if connection string includes username/password
   - Verify database name in connection string

2. **CORS Errors**
   - Backend already has CORS enabled
   - Ensure frontend URL is correct

3. **Build Fails**
   - Check Render logs for specific errors
   - Ensure all dependencies are in package.json

4. **Free Tier Sleep**
   - Render free tier sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - Consider upgrading for production use

## MongoDB Atlas Setup (if needed)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Database Access → Add Database User
4. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Connect → Connect your application → Copy connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `in-out`

## Post-Deployment

After successful deployment:
1. Test all API endpoints
2. Test authentication flow
3. Test booking creation
4. Test Razorpay payment integration
5. Monitor Render logs for any errors
