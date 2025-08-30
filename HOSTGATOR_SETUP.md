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
     "localPath": "./src",
     "remotePath": "/public_html"
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
- **Staging**: `stage.myl.zip` → Hostgator
- **Production**: `myl.zip` → Google Cloud Run (portal)

## 🔧 Detailed Setup

### **Hostgator Account Setup**

#### **1. Choose Hosting Plan**
- **Hatchling Plan**: $2.75/month (basic)
- **Baby Plan**: $3.95/month (recommended)
- **Business Plan**: $5.95/month (advanced)

#### **2. Domain Registration**
- **Register**: `myl.zip` domain
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
  "localPath": "./src",
  "remotePath": "/public_html",
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
   📁 logs
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
🌐 Your staging site should be live at: https://stage.myl.zip
```

## 🌐 Domain Configuration

### **Staging Domain Setup**
1. **Create subdomain**: `stage.myl.zip`
2. **Point DNS** to Hostgator IP address
3. **Enable SSL** in Hostgator control panel
4. **Test** `https://stage.myl.zip`

### **Production Domain Setup**
1. **Keep existing**: `myl.zip` → Google Cloud Run
2. **Cloud Run portal** syncs from stage.myl.zip
3. **Auto-deployment** via GitHub integration

### **DNS Configuration**
```
stage.myl.zip → Hostgator (staging)
myl.zip → Google Cloud Run (production portal)
www.myl.zip → Google Cloud Run (production portal)
```

## 📊 Monitoring Setup

### **Staging Monitoring (Hostgator)**
- **Uptime monitoring**: Ping stage.myl.zip every 5 minutes
- **PageSpeed Insights**: Monitor load times
- **Error logging**: Check Hostgator error logs

### **Production Monitoring (Cloud Run)**
- **Google Cloud Console**: Monitor Cloud Run service
- **Uptime monitoring**: Ping myl.zip every 5 minutes
- **Portal sync status**: Monitor sync from staging

## 🔄 Deployment Workflow

### **Normal Workflow (Staging → Production)**
1. **Make changes** locally in `src/` directory
2. **Test locally** by opening `src/index.html`
3. **Deploy to staging**: `deploy.bat`
4. **Test staging**: Check `https://stage.myl.zip`
5. **Sync to production**: `sync-to-production.bat`
6. **Verify production**: Check `https://myl.zip`

### **Direct Production Workflow**
1. **Make changes** locally in `src/` directory
2. **Commit and push**: `git add . && git commit -m "Update" && git push`
3. **Cloud Run auto-deploys** (bypasses staging)
4. **Optional**: Sync to staging: `sync-from-production.bat`

### **Sync Workflows**
```bash
# Deploy to staging
deploy.bat

# Sync staging → production
sync-to-production.bat

# Sync production → staging
sync-from-production.bat

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
1. **Immediate**: Direct users to stage.myl.zip
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

## 💰 Cost Breakdown

### **Hostgator Costs (Staging)**
- **Domain**: Already covered (subdomain)
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
- [ ] DNS configured for stage.myl.zip
- [ ] SSL certificate installed

### **During Staging**
- [ ] Deploy latest content to staging
- [ ] Test all functionality at stage.myl.zip
- [ ] Verify SSL certificate is working
- [ ] Check all pages load correctly
- [ ] Test user workflows

### **After Staging**
- [ ] Sync staging to production
- [ ] Verify production site updated
- [ ] Monitor for any issues
- [ ] Keep staging in sync with production

---

**Remember**: Stage on Hostgator, serve on Cloud Run! 🚀
