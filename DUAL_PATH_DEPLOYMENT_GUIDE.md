# 🚀 Dual Path Deployment Guide

## 📋 Quick Start

### **Option 1: Deploy Staging Only**
```bash
# Build and deploy to Hostgator staging
npm run deploy:staging
```

### **Option 2: Deploy Portal Only**
```bash
# Build and deploy to Google Cloud Run portal
npm run deploy:portal
```

### **Option 3: Deploy Both**
```bash
# Build and deploy both environments
npm run deploy:all
```

## 🎯 Environment Overview

| Environment | URL | Purpose | Deployment |
|-------------|-----|---------|------------|
| **Staging** | `stage.myl.zip` | Development & Testing | FTP to Hostgator |
| **Portal** | `myl.zip` | Production & Public | GitHub → Cloud Run |

## 🔧 Development Workflows

### **Staging Development**
```bash
# 1. Edit staging content
cd staging/
# Edit files...

# 2. Test locally
npm run test:staging

# 3. Deploy to staging
npm run deploy:staging

# 4. Test at stage.myl.zip
```

### **Portal Development**
```bash
# 1. Edit portal content
cd portal/
# Edit files...

# 2. Test locally
npm run test:portal

# 3. Deploy to portal
npm run deploy:portal

# 4. Test at myl.zip
```

### **Shared Development**
```bash
# 1. Edit shared components
cd shared/
# Edit files...

# 2. Build all environments
npm run build:all

# 3. Deploy all environments
npm run deploy:all
```

## 🔄 Sync Workflows

### **Staging → Portal**
```bash
# Sync staging content to portal
cd hostgator/
sync-to-portal.bat
```

### **Portal → Staging**
```bash
# Sync portal content to staging
cd cloud-run/
sync-to-staging.bat
```

## 📁 Directory Structure

```
zip-myl-www/
├── staging/           # Staging content (Hostgator)
├── portal/            # Portal content (Cloud Run)
├── shared/            # Shared components
├── hostgator/         # Hostgator deployment
├── src/              # Cloud Run deployment
└── scripts/          # Build scripts
```

## 🎨 Content Differences

### **Staging Content**
- **Design**: Development-focused
- **Features**: Testing tools, debug info
- **Audience**: Developers, testers
- **URL**: `stage.myl.zip`

### **Portal Content**
- **Design**: Production-focused
- **Features**: Enhanced UI, analytics
- **Audience**: End users, customers
- **URL**: `myl.zip`

## 🚨 Emergency Procedures

### **Staging Down**
```bash
# Quick recovery
cd hostgator/
deploy.bat
```

### **Portal Down**
```bash
# Fallback to staging
# Redirect DNS to stage.myl.zip
```

## 📊 Monitoring

### **Staging Monitoring**
- **URL**: `https://stage.myl.zip`
- **Status**: Manual check
- **Recovery**: FTP re-upload

### **Portal Monitoring**
- **URL**: `https://myl.zip`
- **Status**: Cloud Run console
- **Recovery**: Auto-deploy on push

## 💡 Best Practices

### **Development**
1. **Always test in staging first**
2. **Use staging for feature validation**
3. **Sync to portal when ready**
4. **Monitor both environments**

### **Deployment**
1. **Build before deploying**
2. **Test after deployment**
3. **Monitor for issues**
4. **Have rollback plan**

### **Content Management**
1. **Keep staging and portal in sync**
2. **Use shared components when possible**
3. **Version control everything**
4. **Document changes**

## 🔧 Troubleshooting

### **Build Issues**
```bash
# Clean and rebuild
rm -rf node_modules
npm install
npm run build:all
```

### **Deployment Issues**
```bash
# Check logs
# Verify credentials
# Test connection
```

### **Sync Issues**
```bash
# Manual sync
git add .
git commit -m "Manual sync"
git push
```

## 🎯 Next Steps

1. **Test both environments**
2. **Set up monitoring**
3. **Configure alerts**
4. **Document procedures**

---

**Remember**: Staging for development, Portal for production! 🚀
