# 🚀 Hostgator Staging Setup Guide

## 📋 Quick Start

### **Step 1: Get Hostgator Account**
1. **Sign up** for Hostgator hosting plan
2. **Register domain** `myl.zip` (or use existing domain)
3. **Get FTP credentials** from Hostgator control panel

### **Step 2: Configure FTP Settings**
1. **Edit** `hostgator/ftp-config.json`
2. **Fill in** your Hostgator FTP credentials:
   ```json
   {
     "host": "your-server.com",
     "username": "your-ftp-username", 
     "password": "your-ftp-password",
     "port": 21,
     "secure": false,
     "localPath": "./staging-deploy",
     "remotePath": "/public_html/website_1a41642e"
   }
   ```

### **Step 3: Test Connection**
```bash
cd hostgator
test-connection.bat
```

### **Step 4: Initial Deployment**
```bash
deploy.bat
```

### **Step 5: Configure Domains**
- **Master Domain**: `xdmiq.com` → `~/public_html/` (root)
- **Staging Domain**: `zaido.org` → `~/public_html/website_1a41642e/`

## 🔧 Detailed Setup

### **Hostgator Account Setup**

#### **1. Choose Hosting Plan**
- **Hatchling Plan**: $2.75/month (basic)
- **Baby Plan**: $3.95/month (recommended)
- **Business Plan**: $5.95/month (advanced)

#### **2. Domain Registration**
- **Master Domain**: `xdmiq.com` (serves from root `public_html`)
- **Staging Domain**: `zaido.org` (serves from subdirectory)
- **DNS Settings**: Point to Hostgator nameservers
- **SSL Certificate**: Enable free Let's Encrypt SSL

#### **3. FTP Access**
- **Username**: Usually your domain name
- **Password**: Set in Hostgator control panel
- **Server**: Your server hostname
- **Port**: 21 (standard FTP)

### **FTP Configuration**

#### **Find Your FTP Details**
1. **Login** to Hostgator control panel
2. **Go to** "Files" → "FTP Accounts"
3. **Note down**:
   - FTP Server
   - Username
   - Password
   - Port (usually 21)

#### **Update ftp-config.json**
```json
{
  "host": "your-server.com",
  "username": "your-ftp-username",
  "password": "your-ftp-password", 
  "port": 21,
  "secure": false,
  "localPath": "./staging-deploy",
  "remotePath": "/public_html/website_1a41642e",
  "exclude": [
    ".git",
    "node_modules",
    "*.log"
  ],
  "include": [
    "*.html",
    "*.css", 
    "*.js",
    "*.png",
    "*.jpg",
    "*.gif"
  ]
}
```

### **Testing Your Setup**

#### **1. Test FTP Connection**
```bash
cd hostgator
test-connection.bat
```

**Expected Output:**
```
🔌 Testing connection to Hostgator...
✅ Connection successful!
📁 Current directory: /
📋 Files in current directory:
   📁 public_html
✅ Navigation successful!
🎉 All tests passed!
```

#### **2. Test Deployment**
```bash
deploy.bat
```

**Expected Output:**
```
🚀 Hostgator Deployment Script
📦 Installing dependencies...
🔄 Starting deployment to Hostgator...
📤 Uploading files...
✅ All files uploaded successfully!
📋 Uploaded files:
   📄 index.html (1704 bytes)
   📄 setup-wizard.html (8450 bytes)
   📄 css/style.css (179 bytes)
   📄 css/setup-wizard.css (376 bytes)
   📄 js/main.js (78 bytes)
   📄 js/setup-wizard.js (394 bytes)
✅ index.html found - deployment looks good!
🎉 Deployment completed successfully!
🌐 Your staging site should be live at: http://zaido.org
```

## 🌐 Domain Configuration

### **Hosting Structure**
```
~/public_html/                    # Master domain (xdmiq.com)
├── index.html                   # xdmiq.com content
├── other-files/                 # xdmiq.com files
└── website_1a41642e/           # Staging domain (zaido.org)
    ├── index.html              # Staging content
    ├── css/
    ├── js/
    └── setup-wizard.html
```

### **Staging Domain Setup**
1. **Subdirectory**: `website_1a41642e` in `public_html`
2. **Content Source**: Files from `zip-myl-www/src/`
3. **Domain Mapping**: `zaido.org` → `/public_html/website_1a41642e/`
4. **Test**: `http://zaido.org`

### **Production Domain Setup**
1. **Keep existing**: `myl.zip` → Google Cloud Run (frontend portal)
2. **API Service**: `api.myl.zip` → Google Cloud Run (backend API)
3. **Cloud Run portal** syncs from zaido.org
4. **Auto-deployment** via GitHub integration

### **API Service Configuration**
- **Service Name**: `zip-myl-api` (Google Cloud Run)
- **Domain**: `api.myl.zip`
- **Purpose**: Backend API for setup wizard and Chrome extension
- **Endpoints**: SSL certificate provisioning, API key generation
- **Authentication**: Device-based, SSL-certified
- **Auto-deployment**: Via GitHub integration

### **DNS Configuration**
```
xdmiq.com → ~/public_html/ (master domain)
zaido.org → ~/public_html/website_1a41642e/ (staging)
myl.zip → Google Cloud Run (production frontend portal)
api.myl.zip → Google Cloud Run (production backend API)
```

## 📊 Monitoring Setup

### **Staging Monitoring (Hostgator)**
- **Uptime monitoring**: Ping zaido.org every 5 minutes
- **PageSpeed Insights**: Monitor load times
- **Error logging**: Check Hostgator error logs

### **Production Monitoring (Cloud Run)**
- **Google Cloud Console**: Monitor Cloud Run services
- **Frontend Monitoring**: Ping myl.zip every 5 minutes
- **API Monitoring**: Ping api.myl.zip every 5 minutes
- **Portal sync status**: Monitor sync from staging
- **API Health Checks**: Monitor backend service status

## 🔄 Deployment Workflow

### **Normal Workflow (Staging → Production)**
1. **Make changes** locally in `staging/` directory
2. **Test locally** by opening `staging/index.html`
3. **Deploy to staging**: `deploy.bat`
4. **Test staging**: Check `http://zaido.org`
5. **Sync to production**: `sync-to-portal.bat`
6. **Verify production**: Check `https://myl.zip`

### **Direct Production Workflow**
1. **Make changes** locally in `portal/` directory
2. **Commit and push**: `git add . && git commit -m "Update" && git push`
3. **Cloud Run auto-deploys** (bypasses staging)
4. **Optional**: Sync to staging: `sync-from-portal.bat`

### **Sync Workflows**
```bash
# Deploy to staging
deploy.bat

# Sync staging → production
sync-to-portal.bat

# Sync production → staging
sync-from-portal.bat

# Test staging connection
test-connection.bat
```

## 🚨 Emergency Procedures

### **Staging Down**
1. **Continue**: Production remains available
2. **Monitor**: Watch for staging recovery
3. **Update**: Keep production content current
4. **Recovery**: Staging auto-deploys on fix

### **Production Down**
1. **Immediate**: Direct users to zaido.org
2. **Investigation**: Check Cloud Run status
3. **Recovery**: Restore Cloud Run service
4. **Sync**: Ensure production has latest content

### **Both Down**
1. **Emergency**: Use backup hosting
2. **Investigation**: Check both services
3. **Recovery**: Restore both services
4. **Sync**: Ensure consistency

## 🚨 Troubleshooting

### **FTP Connection Issues**
- **Check credentials** in `ftp-config.json`
- **Verify Hostgator account** is active
- **Test with FileZilla** or similar FTP client
- **Contact Hostgator support**

### **Deployment Issues**
- **Check file permissions** on Hostgator
- **Verify file paths** in configuration
- **Check for file conflicts** on server
- **Review deployment logs**

### **DNS Issues**
- **DNS propagation** takes 24-48 hours
- **SSL certificate** may take time to activate
- **Check domain status** in Hostgator panel
- **Monitor propagation** at whatsmydns.net

### **403 Forbidden Errors**
- **Check domain mapping** to correct subdirectory
- **Verify file permissions** in subdirectory
- **Ensure content** is in correct location
- **Test with SSL certificate domain** if needed

## 💰 Cost Breakdown

### **Hostgator Costs (Staging)**
- **Domain**: Already covered (subdirectory)
- **Hosting**: ~$3.95/month (Baby Plan)
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$47/year

### **Cloud Run Costs (Production)**
- **Compute**: ~$0-5/month (low traffic)
- **Storage**: ~$0-2/month
- **Domain**: ~$15/year
- **Total**: ~$15-87/year

### **Total Strategy Cost**
- **Combined**: ~$62-134/year
- **Staging + Production**: Worth the cost for reliability

## 📞 Support Resources

### **Hostgator Support**
- **Live Chat**: Available 24/7
- **Phone**: 1-866-96-GATOR
- **Email**: support@hostgator.com
- **Knowledge Base**: help.hostgator.com

### **Cloud Run Support**
- **Google Cloud Console**: Monitor service status
- **Cloud Run Issues**: Check Google Cloud console
- **Deployment Issues**: Check build logs

### **DNS Support**
- **Domain Issues**: Contact domain registrar
- **DNS Propagation**: Monitor at whatsmydns.net
- **SSL Issues**: Check certificate status

## 🎯 Next Steps

1. **Complete Hostgator setup** following this guide
2. **Test staging deployment** workflow
3. **Configure production portal** sync
4. **Set up monitoring** for both environments
5. **Document procedures** for team use

## 📋 Staging Checklist

### **Before Staging**
- [ ] Hostgator account active
- [ ] FTP credentials configured
- [ ] Test deployment successful
- [ ] DNS configured for zaido.org
- [ ] SSL certificate installed

### **During Staging**
- [ ] Deploy latest content to staging
- [ ] Test all functionality at zaido.org
- [ ] Verify SSL certificate is working
- [ ] Check all pages load correctly
- [ ] Test user workflows

### **After Staging**
- [ ] Sync staging to production
- [ ] Verify production site updated
- [ ] Monitor for any issues
- [ ] Keep staging in sync with production

---

**Remember**: Master domain in root, staging in subdirectory! 🚀
