# 🔧 FTP Configuration Setup

## 📋 Required Information

Before deploying to Hostgator staging, you need to update `ftp-config.json` with your Hostgator credentials:

### **1. Get Your Hostgator FTP Details**

1. **Login** to your Hostgator control panel
2. **Go to** "Files" → "FTP Accounts"
3. **Note down**:
   - **FTP Server** (hostname)
   - **Username** (usually your domain name)
   - **Password** (set in Hostgator control panel)

### **2. Update ftp-config.json**

Edit `ftp-config.json` and replace these values:

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

### **3. Test Connection**

After updating the credentials, test the connection:

```bash
cd hostgator
test-connection.bat
```

### **4. Deploy to Staging**

Once the connection test passes, deploy to staging:

```bash
deploy.bat
```

## 🌐 Expected Results

After successful deployment:
- **Staging URL**: `https://stage.myl.zip`
- **Landing Page**: `https://stage.myl.zip`
- **Setup Wizard**: `https://stage.myl.zip/setup-wizard.html`

## 🚨 Troubleshooting

If connection fails:
1. **Check credentials** in `ftp-config.json`
2. **Verify Hostgator account** is active
3. **Test with FileZilla** or similar FTP client
4. **Contact Hostgator support**

---

**Next**: After FTP setup, run `deploy.bat` to push to staging! 🚀
