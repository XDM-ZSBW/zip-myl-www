# Google Cloud Run Setup Guide

## 🚀 Quick Setup Steps

### 1. **Enable Required APIs**
In your Google Cloud Console, enable these APIs:
- Cloud Run API
- Cloud Build API
- Container Registry API

### 2. **Create Cloud Run Service**
1. Go to [Cloud Run Console](https://console.cloud.google.com/run?project=zip-myl-www)
2. Click **"Create Service"**
3. Select **"Continuously deploy from a Git repository"**
4. Connect your GitHub account if not already connected

### 3. **Configure Repository Connection**
- **Repository**: `XDM-ZSBW/zip-myl-www`
- **Branch**: `main`
- **Build configuration**: Use `cloudbuild.yaml`
- **Service name**: `zip-myl-www`
- **Region**: `us-central1`

### 4. **Service Configuration**
- **CPU**: 1
- **Memory**: 512 MiB
- **Maximum instances**: 10
- **Minimum instances**: 0
- **Port**: 8080
- **Allow unauthenticated**: Yes

### 5. **Automatic Deployment**
Once configured, every commit to the `main` branch will:
1. Trigger Cloud Build
2. Build Docker container
3. Deploy to Cloud Run
4. Update the service URL

## 🔧 Configuration Files

### **Dockerfile**
- Uses nginx:alpine for serving static files
- Copies `src/` contents to web root
- Exposes port 8080 (Cloud Run requirement)

### **nginx.conf**
- Optimized for static file serving
- Gzip compression enabled
- Security headers configured
- SPA routing support

### **cloudbuild.yaml**
- Defines build and deployment steps
- Uses Cloud Build for container creation
- Automatically deploys to Cloud Run

## 🌐 Service URL
After deployment, your service will be available at:
```
https://zip-myl-www-[hash]-uc.a.run.app
```

## 📊 Monitoring
- View logs in Cloud Run console
- Monitor performance in Cloud Monitoring
- Set up alerts for errors or high latency

## 🔒 Security
- Service runs with minimal permissions
- HTTPS automatically enabled
- Security headers configured in nginx
- No authentication required (public service)

## 🚨 Troubleshooting
- Check Cloud Build logs for build issues
- Verify nginx configuration syntax
- Ensure all files are properly copied to container
- Monitor Cloud Run service logs for runtime issues
