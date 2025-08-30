# 🚀 HostGator Setup Guide for stage.myl.zip

## 📋 Prerequisites

1. **HostGator Account**: Active hosting account
2. **Domain Control**: Access to DNS settings for `stage.myl.zip`
3. **FTP Credentials**: HostGator FTP username and password

## 🔧 Step 1: Configure FTP Deployment

### Update FTP Configuration
Edit `ftp-config.json` with your HostGator credentials:

```json
{
  "host": "stage.myl.zip",
  "user": "your-hostgator-username",
  "password": "your-hostgator-password",
  "port": 21,
  "secure": false,
  "localPath": "./src",
  "remotePath": "/public_html",
  "verbose": true,
  "createBackup": true
}
```

### Install Dependencies
```bash
npm install
```

## 🌐 Step 2: DNS Configuration

### Point Domain to HostGator
Configure your DNS settings to point `stage.myl.zip` to HostGator's servers:

1. **Go to your domain registrar** (where you bought `myl.zip`)
2. **Add DNS record**:
   ```
   Type: A
   Name: stage
   Value: [HostGator IP Address]
   ```

### HostGator Nameservers (Alternative)
If using HostGator nameservers:
1. **Get nameservers** from HostGator control panel
2. **Update nameservers** at your domain registrar
3. **Wait 24-48 hours** for propagation

## 🔒 Step 3: Let's Encrypt SSL Setup

### Option A: HostGator AutoSSL (Recommended)
1. **Login to HostGator cPanel**
2. **Go to "SSL/TLS"** section
3. **Click "Install SSL Certificate"**
4. **Select "Let's Encrypt"**
5. **Enter domain**: `stage.myl.zip`
6. **Click "Install"**

### Option B: Manual Let's Encrypt (Advanced)
If HostGator doesn't support Let's Encrypt:

1. **SSH into your HostGator server**
2. **Install Certbot**:
   ```bash
   wget https://dl.eff.org/certbot-auto
   chmod a+x certbot-auto
   ```

3. **Generate certificate**:
   ```bash
   ./certbot-auto certonly --webroot -w /home/username/public_html -d stage.myl.zip
   ```

4. **Configure Apache/Nginx** to use the certificate

## 🚀 Step 4: Deploy Your Site

### Deploy to HostGator
```bash
npm run deploy:hostgator
```

### Verify Deployment
1. **Visit**: https://stage.myl.zip
2. **Check SSL**: Look for padlock in browser
3. **Test functionality**: Ensure all features work

## 🔄 Step 5: Automated Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy-hostgator.yml`:

```yaml
name: Deploy to HostGator
on:
  push:
    branches: [main]
    paths: ['src/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run deploy:hostgator
        env:
          FTP_HOST: ${{ secrets.FTP_HOST }}
          FTP_USER: ${{ secrets.FTP_USER }}
          FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
```

## 🛠️ Troubleshooting

### Common Issues

1. **FTP Connection Failed**
   - Verify credentials in `ftp-config.json`
   - Check if HostGator allows FTP access
   - Try different port (21 or 22)

2. **SSL Certificate Not Working**
   - Wait 24-48 hours for DNS propagation
   - Check if Let's Encrypt is supported
   - Verify domain points to HostGator

3. **Files Not Uploading**
   - Check file permissions
   - Verify remote path exists
   - Ensure sufficient disk space

### Support Resources
- **HostGator Support**: Live chat or ticket system
- **Let's Encrypt Docs**: https://letsencrypt.org/docs/
- **DNS Propagation Checker**: https://www.whatsmydns.net/

## 📞 Next Steps

1. **Update FTP credentials** in `ftp-config.json`
2. **Configure DNS** to point to HostGator
3. **Install Let's Encrypt SSL** via cPanel
4. **Run deployment**: `npm run deploy:hostgator`
5. **Test your site** at https://stage.myl.zip

Your staging environment will be ready! 🎉
