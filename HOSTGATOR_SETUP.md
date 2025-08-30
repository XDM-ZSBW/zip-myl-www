# 🚀 Hostgator Setup Guide

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

### **Step 4: Deploy**
```bash
deploy.bat
```

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
🌐 Your site should be live at: https://myl.zip
```

## 🌐 Domain Configuration

### **Primary Domain Setup**
1. **Point DNS** to Hostgator nameservers
2. **Enable SSL** in Hostgator control panel
3. **Test** `https://myl.zip`

### **Portal Domain Setup**
1. **Create subdomain**: `portal.myl.zip`
2. **Point** to Google Cloud Run URL
3. **Test** `https://portal.myl.zip`

### **Fallback Domain Setup**
1. **Create subdomain**: `backup.myl.zip`
2. **Point** to Google Cloud Run URL
3. **Use** for emergency redirects

## 📊 Monitoring Setup

### **Uptime Monitoring**
- **Service**: UptimeRobot (free)
- **URL**: `https://myl.zip`
- **Interval**: 5 minutes
- **Alerts**: Email/SMS on downtime

### **Performance Monitoring**
- **Google Analytics**: Track visitor behavior
- **PageSpeed Insights**: Monitor load times
- **Core Web Vitals**: Track user experience

## 🔄 Deployment Workflow

### **Daily Workflow**
1. **Make changes** locally in `src/` directory
2. **Test locally** by opening `src/index.html`
3. **Deploy to Hostgator**: `deploy.bat`
4. **Verify**: Check `https://myl.zip`
5. **Optional**: Sync to Cloud Run: `sync-to-cloud.bat`

### **Emergency Workflow**
1. **Hostgator down**: Redirect to Cloud Run
2. **Cloud Run down**: Hostgator continues serving
3. **Both down**: Use backup domain

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

### **Domain Issues**
- **DNS propagation** takes 24-48 hours
- **SSL certificate** may take time to activate
- **Check domain status** in Hostgator panel

## 💰 Cost Breakdown

### **Hostgator Costs**
- **Domain**: $15/year
- **Hosting**: $3.95/month (Baby Plan)
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$62/year

### **Additional Services**
- **Uptime Monitoring**: Free (UptimeRobot)
- **Analytics**: Free (Google Analytics)
- **CDN**: Optional ($5-10/month)

## 📞 Support Resources

### **Hostgator Support**
- **Live Chat**: Available 24/7
- **Phone**: 1-866-96-GATOR
- **Email**: support@hostgator.com
- **Knowledge Base**: help.hostgator.com

### **Technical Support**
- **FTP Issues**: Hostgator support
- **Domain Issues**: Hostgator support
- **SSL Issues**: Hostgator support
- **Deployment Issues**: Check logs and configuration

## 🎯 Next Steps

1. **Complete Hostgator setup** following this guide
2. **Test deployment** with sample content
3. **Configure monitoring** and alerts
4. **Set up backup procedures**
5. **Document team procedures**

---

**Remember**: Hostgator for speed, Cloud Run for safety! 🚀
