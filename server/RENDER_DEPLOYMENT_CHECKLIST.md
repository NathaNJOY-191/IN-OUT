# Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### Files Ready
- [x] `render.yaml` - Render configuration file
- [x] `package.json` - Updated with razorpay dependency and Node.js engine
- [x] `.gitignore` - Excludes node_modules and .env
- [x] `index.js` - Main server file
- [x] `seed.js` - Database seeding script

### Required Information to Gather

Before deploying, make sure you have:

1. **MongoDB Atlas Connection String**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/in-out?retryWrites=true&w=majority`
   - Database name should be `in-out`
   - Network access set to allow all IPs (0.0.0.0/0)

2. **JWT Secret**
   - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Or any secure random string (min 32 characters)

3. **Razorpay Credentials**
   - Key ID: `rzp_test_...` or `rzp_live_...`
   - Key Secret: Your Razorpay secret key

4. **GitHub Repository**
   - Repository URL where your code is hosted
   - Make sure server folder is pushed to GitHub

## 📋 Deployment Steps

### Step 1: Push Code to GitHub
```bash
# Navigate to your project root
cd "c:\Users\natha\OneDrive\Desktop\joyboy-project\In-out"

# Check git status
git status

# Add server changes
git add server/

# Commit changes
git commit -m "Add Render deployment configuration"

# Push to GitHub
git push origin main
```

### Step 2: Create Render Web Service

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (if not connected)
4. Select your repository: `joyboy-project` or your repo name
5. Click **"Connect"**

### Step 3: Configure Service

Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `in-out-backend` |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `In-out/server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
MONGODB_URI = <your-mongodb-atlas-connection-string>
JWT_SECRET = <your-generated-secret>
RAZORPAY_KEY_ID = <your-razorpay-key-id>
RAZORPAY_KEY_SECRET = <your-razorpay-secret>
NODE_ENV = production
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Monitor logs for any errors
4. Once deployed, note your backend URL: `https://in-out-backend.onrender.com`

### Step 6: Update Frontend

1. Go to Vercel Dashboard
2. Select your `in-out` project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   ```
   VITE_API_URL = https://your-render-backend-url.onrender.com
   ```
5. Go to **Deployments** → Click **"..."** on latest → **"Redeploy"**

### Step 7: Test Everything

Test these URLs in browser/Postman:

1. **Health Check**: `https://your-backend-url.onrender.com/`
   - Should return: "In-out API is running..."

2. **Get Rooms**: `https://your-backend-url.onrender.com/rooms`
   - Should return array of 20 rooms

3. **Frontend**: `https://in-out-iota.vercel.app/`
   - Should load rooms
   - Test sign up/sign in
   - Test booking flow

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify connection string has correct username/password
- Ensure database name is `in-out`

### Issue: "Module not found"
**Solution**:
- Check package.json has all dependencies
- Trigger rebuild in Render dashboard

### Issue: "CORS error from frontend"
**Solution**:
- CORS is already enabled in index.js
- Verify VITE_API_URL in Vercel is correct
- Redeploy frontend after updating env var

### Issue: "Service sleeps after inactivity"
**Solution**:
- This is normal for Render free tier
- First request after 15 min takes ~30 seconds
- Consider paid tier for production

## 📝 Post-Deployment Notes

- **Free Tier Limitations**: 
  - Service sleeps after 15 minutes of inactivity
  - 750 hours/month free
  - Slower performance than paid tiers

- **Monitoring**:
  - Check Render logs regularly
  - Set up error notifications in Render dashboard

- **Security**:
  - Never commit .env files
  - Use strong JWT_SECRET
  - Keep Razorpay keys secure

## ✨ Success Criteria

Your deployment is successful when:
- ✅ Backend URL returns "In-out API is running"
- ✅ `/rooms` endpoint returns 20 rooms
- ✅ Frontend can fetch and display rooms
- ✅ User can sign up/sign in
- ✅ Booking creation works
- ✅ Razorpay payment integration works
