# 🏗️ Zip MyL Services Architecture Overview

## 📋 Complete Service Architecture

This document provides a comprehensive overview of all services in the Zip MyL ecosystem.

## 🌐 Domain & Service Mapping

### **Hostgator Services (Shared Hosting)**
```
xdmiq.com → ~/public_html/ (master domain)
zaido.org → ~/public_html/website_1a41642e/ (staging)
```

### **Google Cloud Run Services**
```
myl.zip → zip-myl-www (frontend portal)
api.myl.zip → zip-myl-backend (backend API)
```

## 🔧 Service Details

### **1. Master Domain Service**
- **Domain**: `xdmiq.com`
- **Location**: `~/public_html/` (Hostgator root)
- **Purpose**: Main business website
- **Content**: Business information, main site
- **Deployment**: Manual FTP upload
- **SSL**: Let's Encrypt (free)

### **2. Staging Environment Service**
- **Domain**: `zaido.org`
- **Location**: `~/public_html/website_1a41642e/` (Hostgator subdirectory)
- **Purpose**: Development and testing environment
- **Content**: Zip MyL staging content (from `zip-myl-www/src/`)
- **Deployment**: Automated FTP via `deploy.bat`
- **SSL**: Let's Encrypt (free)
- **Features**:
  - Setup wizard testing
  - Backend integration testing
  - Performance monitoring
  - Development iteration

### **3. Production Frontend Service**
- **Domain**: `myl.zip`
- **Service**: `zip-myl-www` (Google Cloud Run)
- **Purpose**: Production frontend portal
- **Content**: Production-optimized frontend
- **Deployment**: GitHub → Cloud Run (automatic)
- **SSL**: Google-managed certificates
- **Features**:
  - Global CDN
  - Auto-scaling
  - Built-in monitoring
  - Progressive enhancement

### **4. Production Backend API Service**
- **Domain**: `api.myl.zip`
- **Service**: `zip-myl-backend` (Google Cloud Run)
- **Purpose**: Backend API for setup wizard and Chrome extension
- **Deployment**: GitHub → Cloud Run (automatic)
- **SSL**: Google-managed certificates
- **Authentication**: Device-based, SSL-certified
- **Key Endpoints**:
  - `POST /api/v1/device/register` - Device registration with UUID generation
  - `POST /api/v1/ssl/provision` - Auto-provision UUID subdomain (e.g., `abc123-def456-ghi789.myl.zip`)
  - `POST /api/v1/ssl/generate-extension-key` - API key generation
  - `GET /api/v1/ssl/verify` - SSL certificate verification
- **Features**:
  - Device registration with UUID generation
  - Automatic UUID subdomain provisioning
  - SSL certificate management (Google-managed wildcard *.myl.zip)
  - API key generation
  - Security validation

## 🔄 Service Interactions

### **Setup Wizard Flow**
```
1. User visits zaido.org (staging) or myl.zip (production)
2. Setup wizard calls api.myl.zip to register device
3. Backend generates UUID and creates subdomain (e.g., abc123-def456-ghi789.myl.zip)
4. Backend uses existing wildcard SSL certificate (*.myl.zip)
5. Backend generates API key for the device
6. User gets configured for Chrome extension with their unique subdomain
```

### **Chrome Extension Flow**
```
1. Extension installed from Chrome Web Store
2. Extension authenticates with api.myl.zip
3. Extension uses device-based authentication
4. Extension accesses backend services securely
```

### **Deployment Flow**
```
1. Development → Local testing
2. Staging → zaido.org (Hostgator)
3. Production → myl.zip (Cloud Run)
4. API → api.myl.zip (Cloud Run)
```

## 📊 Monitoring & Health Checks

### **Staging Monitoring (zaido.org)**
- **Uptime**: Ping every 5 minutes
- **Performance**: Page load times
- **Errors**: 404s, 500s, etc.
- **SSL**: Certificate status

### **Frontend Monitoring (myl.zip)**
- **Service Health**: Cloud Run service status
- **Uptime**: Ping every 5 minutes
- **Performance**: Response times
- **Traffic**: Usage patterns
- **Errors**: Application errors

### **API Monitoring (api.myl.zip)**
- **Service Health**: Cloud Run service status
- **Uptime**: Ping every 5 minutes
- **API Health**: Endpoint availability
- **Authentication**: Device registration success
- **SSL Provisioning**: Certificate generation success
- **Error Rates**: API errors and failures

## 🚨 Emergency Procedures

### **Staging Down (zaido.org)**
- **Impact**: Development/testing affected
- **Recovery**: Quick FTP re-upload
- **Fallback**: Continue with production

### **Frontend Down (myl.zip)**
- **Impact**: Production users affected
- **Recovery**: Cloud Run auto-restart
- **Fallback**: Direct users to zaido.org

### **API Down (api.myl.zip)**
- **Impact**: Setup wizard and extension non-functional
- **Recovery**: Cloud Run auto-restart
- **Fallback**: Manual setup procedures

### **All Services Down**
- **Emergency**: Use backup hosting
- **Investigation**: Check all services
- **Recovery**: Restore services in priority order
- **Communication**: Notify users of status

## 💰 Cost Analysis

### **Hostgator Costs**
- **Master Domain**: Covered by existing hosting
- **Staging Domain**: Covered by existing hosting
- **Total**: ~$47/year (Baby Plan)

### **Google Cloud Run Costs**
- **Frontend Service**: ~$0-5/month (low traffic)
- **API Service**: ~$0-5/month (low traffic)
- **Domains**: ~$15/year each
- **Total**: ~$15-87/year

### **Total Architecture Cost**
- **Combined**: ~$62-134/year
- **Benefits**: Complete staging + production + API ecosystem

## 🔒 Security Considerations

### **SSL Certificate Strategy**
- **Wildcard Certificate**: `*.myl.zip` covers all UUID subdomains
- **UUID Subdomains**: `abc123-def456-ghi789.myl.zip` automatically secured
- **Vanity Domains**: Future feature with individual certificates
- **Certificate Management**: Google Cloud Run handles renewal
- **Security Isolation**: Each UUID subdomain is unique and secure

### **Authentication**
- **Device-based**: No admin access for extensions
- **SSL-certified**: All communications encrypted
- **API Keys**: Generated per device
- **Rate Limiting**: 1000 requests/hour per device

### **Data Protection**
- **No sensitive data**: Only device IDs and API keys
- **Temporary storage**: Keys expire after 30 days
- **SSL certificates**: Managed by Let's Encrypt
- **No user accounts**: Device-based identification only

## 🎯 Next Steps

1. **Monitor all services** for health and performance
2. **Test complete workflow** from staging to production
3. **Validate API endpoints** with real Chrome extension
4. **Set up alerts** for service failures
5. **Document procedures** for team use

---

**Remember**: Four services working together - staging, frontend, backend, and master domain! 🚀
