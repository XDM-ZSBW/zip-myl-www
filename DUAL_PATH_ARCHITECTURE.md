# 🏗️ Dual Path Architecture: Staging + Portal

## 📋 Overview

This project implements a **dual code path architecture** with two distinct deployment targets:

1. **Hostgator Staging** (`stage.myl.zip`) - Direct static file deployment
2. **Google Cloud Portal** (`myl.zip`) - Alternative representations and synced content

## 🎯 Architecture Goals

### **Hostgator Staging Path**
- ✅ **Direct static files** - Pure HTML/CSS/JS
- ✅ **Instant deployment** - FTP upload
- ✅ **Development testing** - Quick iterations
- ✅ **Staging environment** - Pre-production validation

### **Google Cloud Portal Path**
- ✅ **Alternative representations** - Different layouts/themes
- ✅ **Enhanced features** - Progressive enhancement
- ✅ **Global CDN** - Faster worldwide access
- ✅ **Auto-sync capability** - From staging content

## 📁 Directory Structure

```
zip-myl-www/
├── src/                          # Source files (both paths)
│   ├── index.html               # Base landing page
│   ├── setup-wizard.html        # Base setup wizard
│   ├── css/
│   │   ├── style.css           # Base styles
│   │   └── setup-wizard.css    # Base wizard styles
│   └── js/
│       ├── main.js             # Base script
│       └── setup-wizard.js     # Base wizard script
├── staging/                      # Hostgator staging path
│   ├── index.html              # Staging-specific landing
│   ├── setup-wizard.html       # Staging-specific wizard
│   ├── css/
│   │   ├── style.css          # Staging styles
│   │   └── setup-wizard.css   # Staging wizard styles
│   └── js/
│       ├── main.js            # Staging script
│       └── setup-wizard.js    # Staging wizard script
├── portal/                       # Google Cloud portal path
│   ├── index.html              # Portal-specific landing
│   ├── setup-wizard.html       # Portal-specific wizard
│   ├── css/
│   │   ├── style.css          # Portal styles
│   │   └── setup-wizard.css   # Portal wizard styles
│   └── js/
│       ├── main.js            # Portal script
│       └── setup-wizard.js    # Portal wizard script
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

## 🚀 Deployment Workflows

### **Path 1: Staging Development**
```bash
# 1. Develop in staging/ directory
# 2. Test locally
# 3. Deploy to Hostgator
cd hostgator
deploy.bat

# 4. Test at stage.myl.zip
# 5. Sync to portal when ready
sync-to-portal.bat
```

### **Path 2: Portal Development**
```bash
# 1. Develop in portal/ directory
# 2. Test locally
# 3. Commit and push to GitHub
git add . && git commit -m "Portal update" && git push

# 4. Cloud Run auto-deploys
# 5. Test at myl.zip
```

### **Path 3: Shared Development**
```bash
# 1. Develop in shared/ directory
# 2. Build both paths
npm run build:staging
npm run build:portal

# 3. Deploy both
deploy-staging.bat
deploy-portal.bat
```

## 🎨 Content Variations

### **Staging Content** (`stage.myl.zip`)
- **Purpose**: Development and testing
- **Style**: Clean, functional
- **Features**: Basic functionality
- **Audience**: Developers, testers

### **Portal Content** (`myl.zip`)
- **Purpose**: Production and public
- **Style**: Enhanced, branded
- **Features**: Progressive enhancement
- **Audience**: End users, customers

## 🔄 Sync Strategies

### **Staging → Portal**
```bash
# Sync staging content to portal
./hostgator/sync-to-portal.bat
```

### **Portal → Staging**
```bash
# Sync portal content to staging
./cloud-run/sync-to-staging.bat
```

### **Bidirectional Sync**
```bash
# Sync both directions
./sync-bidirectional.bat
```

## 📊 Build Process

### **Staging Build**
```bash
npm run build:staging
# - Copies staging/ to hostgator/
# - Optimizes for Hostgator
# - Prepares for FTP upload
```

### **Portal Build**
```bash
npm run build:portal
# - Copies portal/ to cloud-run/
# - Optimizes for Cloud Run
# - Prepares for container deployment
```

### **Shared Build**
```bash
npm run build:shared
# - Builds shared components
# - Updates both staging and portal
# - Maintains consistency
```

## 🎯 Use Cases

### **Staging Use Cases**
- **Development testing** - Quick iterations
- **Feature validation** - Before production
- **Performance testing** - Load testing
- **Integration testing** - Backend integration

### **Portal Use Cases**
- **Production serving** - Live user traffic
- **Alternative layouts** - Different themes
- **Enhanced features** - Progressive enhancement
- **Global distribution** - CDN benefits

## 🔧 Configuration

### **Staging Config**
```json
{
  "environment": "staging",
  "baseUrl": "https://stage.myl.zip",
  "apiUrl": "https://api.myl.zip",
  "features": ["basic", "testing"]
}
```

### **Portal Config**
```json
{
  "environment": "production",
  "baseUrl": "https://myl.zip",
  "apiUrl": "https://api.myl.zip",
  "features": ["enhanced", "analytics", "cdn"]
}
```

## 🚨 Emergency Procedures

### **Staging Down**
- **Continue**: Portal remains available
- **Recovery**: Quick FTP re-upload
- **Impact**: Development/testing affected

### **Portal Down**
- **Fallback**: Redirect to staging
- **Recovery**: Cloud Run auto-deploy
- **Impact**: Production users affected

## 💰 Cost Analysis

### **Staging Costs**
- **Hostgator**: ~$47/year
- **Purpose**: Development/testing
- **Value**: High for development

### **Portal Costs**
- **Cloud Run**: ~$15-87/year
- **Purpose**: Production serving
- **Value**: High for users

### **Total Strategy**
- **Combined**: ~$62-134/year
- **Benefits**: Development + Production
- **ROI**: Excellent for dual environment

## 🎯 Next Steps

1. **Create staging/ directory** with staging-specific content
2. **Create portal/ directory** with portal-specific content
3. **Set up build scripts** for both paths
4. **Configure sync workflows** between paths
5. **Test dual deployment** process

---

**Remember**: Staging for development, Portal for production! 🚀
