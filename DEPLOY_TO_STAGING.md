# 🚀 Deploy to Staging - Quick Guide

## 📋 What We're Deploying

**Landing Page**: `src/index.html`
- ✅ Modern, responsive design
- ✅ Setup wizard integration
- ✅ Google Cloud Run branding

**Setup Wizard**: `src/setup-wizard.html`
- ✅ 4-step SSL certificate setup
- ✅ Extension API key generation
- ✅ User-friendly interface

## 🔧 Prerequisites

1. **Hostgator Account**: Active hosting with FTP access
2. **Domain**: `stage.myl.zip` configured to point to Hostgator
3. **FTP Credentials**: Updated in `hostgator/ftp-config.json`

## 🚀 Deployment Steps

### **Step 1: Update FTP Configuration**

Edit `hostgator/ftp-config.json` with your actual Hostgator credentials:

```json
{
  "host": "your-actual-hostgator-server.com",
  "username": "your-actual-ftp-username", 
  "password": "your-actual-ftp-password",
  "port": 21,
  "secure": false,
  "localPath": "../src",
  "remotePath": "/public_html"
}
```

### **Step 2: Test Connection**

```bash
cd hostgator
test-connection.bat
```

### **Step 3: Deploy to Staging**

```bash
deploy.bat
```

## 🌐 Expected Results

After successful deployment:

- **Staging URL**: `https://stage.myl.zip`
- **Landing Page**: `https://stage.myl.zip`
- **Setup Wizard**: `https://stage.myl.zip/setup-wizard.html`

## 📊 Files Being Deployed

```
src/
├── index.html              # Landing page
├── setup-wizard.html       # Setup wizard
├── css/
│   ├── style.css          # Main styles
│   └── setup-wizard.css   # Wizard styles
└── js/
    ├── main.js            # Main script
    └── setup-wizard.js    # Wizard script
```

## 🎯 Next Steps

1. **Test staging environment** at `https://stage.myl.zip`
2. **Verify setup wizard** functionality
3. **Sync to production** when ready: `sync-to-production.bat`

---

**Ready to deploy?** Update your FTP credentials and run `deploy.bat`! 🚀
