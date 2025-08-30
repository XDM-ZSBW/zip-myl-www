# 🚀 Hostgator Staging + Google Cloud Run Portal Strategy

## 📋 Overview

This strategy uses **Hostgator for staging environment** (`zaido.org`) with **Google Cloud Run as a portal/proxy** (`myl.zip`) that syncs and serves content from the staging environment.

## 🎯 Benefits

### **Hostgator (Staging Environment)**
- ✅ **Instant FTP publishing** - Changes live immediately at zaido.org
- ✅ **Staging environment** - Test changes before production
- ✅ **Cost-effective** - Standard hosting costs
- ✅ **Familiar workflow** - Traditional FTP deployment
- ✅ **No build delays** - Direct file upload

### **Google Cloud Run (Production Portal)**
- ✅ **Production portal** - myl.zip serves staging content
- ✅ **Auto-sync capability** - Automatically syncs from zaido.org
- ✅ **Global CDN** - Faster access worldwide
- ✅ **Built-in monitoring** - Analytics and logging
- ✅ **SSL managed** - Automatic certificate renewal

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │   Hostgator     │    │  Google Cloud   │
│   (Local)       │───▶│   (Staging)     │    │  Run (Portal)   │
│                 │    │  zaido.org      │    │  myl.zip        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Auto-Sync      │
                       │  (Portal Logic)  │
                       └─────────────────┘
```

## 📁 Directory Structure

```
zip-myl-www/
├── src/                          # Source files (both deployments)
│   ├── index.html               # Main page
│   ├── setup-wizard.html        # Setup wizard
│   ├── css/
│   │   ├── style.css           # Main styles
│   │   └── setup-wizard.css    # Wizard styles
│   └── js/
│       ├── main.js             # Main script
│       └── setup-wizard.js     # Wizard script
├── staging/                      # Staging-specific content
│   ├── index.html              # Staging landing page
│   ├── setup-wizard.html       # Staging wizard
│   ├── css/
│   └── js/
├── portal/                       # Portal-specific content
│   ├── index.html              # Portal landing page
│   ├── setup-wizard.html       # Portal wizard
│   ├── css/
│   └── js/
├── hostgator/                   # Hostgator deployment
│   ├── deploy.bat              # Deploy to staging
│   ├── ftp-config.json         # FTP credentials
│   └── sync-to-portal.bat      # Sync to portal
├── cloud-run/                   # Cloud Run deployment
│   ├── Dockerfile              # Container config
│   ├── nginx.conf              # Server config
│   └── cloudbuild.yaml         # Build config
└── shared/                      # Shared components
    ├── components/             # Reusable components
    ├── assets/                # Shared assets
    └── utils/                 # Shared utilities
```

## 🏗️ Hosting Structure

### **Hostgator File System:**
```
~/public_html/                    # Master domain (xdmiq.com)
├── index.html                   # xdmiq.com content
├── other-files/                 # xdmiq.com files
└── website_1a41642e/           # Staging domain (zaido.org)
    ├── index.html              # Staging content (from zip-myl-www/src)
    ├── css/
    ├── js/
    └── setup-wizard.html
```

### **Domain Mapping:**
- **Master Domain**: `xdmiq.com` → `~/public_html/` (root)
- **Staging Domain**: `zaido.org` → `~/public_html/website_1a41642e/`
- **Production Domain**: `myl.zip` → Google Cloud Run (portal)

## 🚀 Deployment Workflows

### **Option 1: Staging → Production (Recommended)**
```bash
# 1. Make changes locally
# 2. Deploy to Hostgator staging
./hostgator/deploy.bat

# 3. Test at zaido.org
# 4. Cloud Run portal auto-syncs to myl.zip
```

### **Option 2: Direct Production**
```bash
# 1. Make changes locally
# 2. Commit and push to GitHub
git add . && git commit -m "Update" && git push

# 3. Cloud Run auto-deploys (bypasses staging)
# 4. Optional: Sync to staging
./cloud-run/sync-to-staging.bat
```

### **Option 3: Manual Sync**
```bash
# Sync staging to production
./hostgator/sync-to-portal.bat

# Sync production to staging
./cloud-run/sync-to-staging.bat
```

## 🔧 Setup Instructions

### **Step 1: Hostgator Staging Setup**
1. **Create Hostgator account** with domain (xdmiq.com)
2. **Set up subdirectory**: `website_1a41642e` in `public_html`
3. **Set up FTP credentials** in `hostgator/ftp-config.json`
4. **Test FTP connection** with `./hostgator/test-connection.bat`
5. **Initial deployment** with `./hostgator/deploy.bat`

### **Step 2: Cloud Run Portal Setup**
1. **Keep existing Cloud Run setup** as production portal
2. **Add portal logic** to sync from zaido.org
3. **Configure auto-sync** from staging environment
4. **Set up monitoring** for both environments

### **Step 3: Domain Configuration**
1. **Master domain**: `xdmiq.com` → Hostgator root
2. **Staging domain**: `zaido.org` → Hostgator subdirectory
3. **Production frontend**: `myl.zip` → Google Cloud Run
4. **Production backend**: `api.myl.zip` → Google Cloud Run (API service)

### **API Service Details**
- **Service Name**: `zip-myl-api` (Google Cloud Run)
- **Domain**: `api.myl.zip`
- **Purpose**: Backend API for setup wizard and Chrome extension
- **Key Endpoints**:
  - `POST /api/v1/ssl/provision` - SSL certificate provisioning
  - `POST /api/v1/ssl/generate-extension-key` - API key generation
  - `POST /api/v1/device/register` - Device registration
- **Authentication**: Device-based, SSL-certified
- **Auto-deployment**: Via GitHub integration

## 📊 Monitoring Strategy

### **Staging Monitoring (Hostgator)**
- ✅ **Uptime monitoring** - Ping zaido.org every 5 minutes
- ✅ **Content verification** - Check key pages load correctly
- ✅ **Performance tracking** - Page load times
- ✅ **Error logging** - 404s, 500s, etc.

### **Production Monitoring (Cloud Run)**
- ✅ **Service health** - Cloud Run service status
- ✅ **Frontend monitoring** - Ping myl.zip every 5 minutes
- ✅ **API monitoring** - Ping api.myl.zip every 5 minutes
- ✅ **Portal sync status** - Sync from staging
- ✅ **Traffic analytics** - Usage patterns
- ✅ **Error rates** - Application errors
- ✅ **API health checks** - Backend service status

## 🔄 Sync Strategy

### **Staging → Production (Auto)**
```bash
# Cloud Run portal automatically syncs from zaido.org
# No manual action needed
```

### **Production → Staging (Manual)**
```bash
# Sync changes from production to staging
./cloud-run/sync-to-staging.bat
```

### **Manual Sync**
```bash
# Force sync from staging to production
./hostgator/sync-to-portal.bat
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

## 💰 Cost Analysis

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

## 🎯 Next Steps

1. **Set up Hostgator staging** environment (zaido.org)
2. **Configure Cloud Run portal** to sync from staging
3. **Test staging workflow** - dev → staging → production
4. **Set up monitoring** for both environments
5. **Document procedures** for team use

## 📞 Support

- **Hostgator Issues**: Contact Hostgator support
- **Cloud Run Issues**: Check Google Cloud console
- **Portal Issues**: Check sync logic and logs
- **Deployment Issues**: Check deployment logs

---

**Remember**: Master domain in root, staging in subdirectory! 🚀
