# 🚀 Hostgator Emergency Setup Guide

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

### **Step 5: Keep DNS Pointing to Cloud Run**
- **Primary**: `myl.zip` → Google Cloud Run
- **Emergency**: `myl.zip` → Hostgator (DNS change only)

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
1. **Keep DNS pointing** to Google Cloud Run
2. **Cloud Run serves** myl.zip (primary)
3. **Hostgator ready** for emergency switch

### **Emergency Domain Setup**
1. **Hostgator IP**: Get from Hostgator control panel
2. **DNS A record**: Change myl.zip to Hostgator IP
3. **SSL**: Automatic with Let's Encrypt

### **DNS Emergency Switch**
```bash
# Emergency DNS switch procedure
emergency-dns-switch.bat
```

## 📊 Monitoring Setup

### **Primary Monitoring (Cloud Run)**
- **Google Cloud Console**: Monitor Cloud Run service
- **Uptime monitoring**: Ping myl.zip every 5 minutes
- **Performance**: Built-in Cloud Run analytics

### **Emergency Monitoring (Hostgator)**
- **Uptime monitoring**: Ping Hostgator URL every 5 minutes
- **PageSpeed Insights**: Monitor load times
- **Error logging**: Check Hostgator error logs

## 🔄 Deployment Workflow

### **Normal Workflow (Cloud Run Primary)**
1. **Make changes** locally in `src/` directory
2. **Test locally** by opening `src/index.html`
3. **Commit and push**: `git add . && git commit -m "Update" && git push`
4. **Cloud Run auto-deploys** (primary)
5. **Optional**: Sync to Hostgator: `sync-from-cloud.bat`

### **Emergency Workflow (Hostgator Failover)**
1. **Cloud Run down**: Detect outage
2. **Deploy to Hostgator**: `deploy.bat`
3. **Change DNS**: Point myl.zip to Hostgator
4. **Monitor**: Watch DNS propagation
5. **Recovery**: Switch back when Cloud Run restored

### **Sync Workflows**
```bash
# Sync Cloud Run → Hostgator (backup)
sync-from-cloud.bat

# Sync Hostgator → Cloud Run (emergency recovery)
sync-to-cloud.bat

# Emergency DNS switch
emergency-dns-switch.bat
```

## 🚨 Emergency Procedures

### **Cloud Run Down (Primary Emergency)**
1. **Immediate**: Deploy to Hostgator: `./hostgator/deploy.bat`
2. **DNS change**: Point myl.zip to Hostgator
3. **Investigation**: Check Cloud Run status
4. **Recovery**: Restore Cloud Run service
5. **DNS change**: Point myl.zip back to Cloud Run

### **Hostgator Down (Backup Emergency)**
1. **Continue**: Cloud Run remains primary
2. **Monitor**: Watch for Hostgator recovery
3. **Update**: Keep Cloud Run content current
4. **Recovery**: Hostgator auto-deploys on fix

### **DNS Emergency Switch**
```bash
# Emergency DNS switch to Hostgator
emergency-dns-switch.bat
```

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

### **Cloud Run Costs (Primary)**
- **Compute**: ~$0-5/month (low traffic)
- **Storage**: ~$0-2/month
- **Domain**: ~$15/year
- **Total**: ~$15-87/year

### **Hostgator Costs (Emergency)**
- **Domain**: Already covered
- **Hosting**: ~$3.95/month (Baby Plan)
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$47/year

### **Total Strategy Cost**
- **Combined**: ~$62-134/year
- **Redundancy**: Worth the cost for reliability

## 📞 Support Resources

### **Cloud Run Support**
- **Google Cloud Console**: Monitor service status
- **Cloud Run Issues**: Check Google Cloud console
- **Deployment Issues**: Check build logs

### **Hostgator Support**
- **Live Chat**: Available 24/7
- **Phone**: 1-866-96-GATOR
- **Email**: support@hostgator.com
- **Knowledge Base**: help.hostgator.com

### **DNS Support**
- **Domain Issues**: Contact domain registrar
- **DNS Propagation**: Monitor at whatsmydns.net
- **SSL Issues**: Check certificate status

## 🎯 Next Steps

1. **Complete Hostgator setup** following this guide
2. **Test emergency deployment** workflow
3. **Configure DNS failover** procedures
4. **Set up monitoring** for both services
5. **Document emergency procedures** for team use

## 📋 Emergency Checklist

### **Before Emergency**
- [ ] Hostgator account active
- [ ] FTP credentials configured
- [ ] Test deployment successful
- [ ] DNS change procedure documented
- [ ] Team trained on emergency procedures

### **During Emergency**
- [ ] Deploy latest content to Hostgator
- [ ] Change DNS A record to Hostgator IP
- [ ] Monitor DNS propagation
- [ ] Verify site loads correctly
- [ ] Keep Hostgator updated

### **After Emergency**
- [ ] Restore Cloud Run service
- [ ] Deploy latest content to Cloud Run
- [ ] Change DNS back to Cloud Run
- [ ] Monitor DNS propagation
- [ ] Verify primary site restored

---

**Remember**: Cloud Run for primary, Hostgator for emergency! 🚀
