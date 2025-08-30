# 🔐 UUID Subdomain System Specification

## 📋 Overview

This document specifies the UUID subdomain system for Zip MyL, which automatically provisions unique subdomains for each registered device, eliminating the need for users to manage their own domains and SSL certificates.

## 🎯 User Experience

### **Before (Complex)**
```
User needs to:
1. Buy a domain name
2. Set up DNS records
3. Get SSL certificate
4. Configure hosting
5. Install Chrome extension
```

### **After (Simple)**
```
User simply:
1. Visits myl.zip setup wizard
2. Clicks "Register Device"
3. Gets unique subdomain: abc123-def456-ghi789.myl.zip
4. Installs Chrome extension
5. Done! ✅
```

## 🏗️ Technical Architecture

### **UUID Generation**
- **Format**: `{uuid-v4}.myl.zip`
- **Example**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.myl.zip`
- **Length**: 36 characters + `.myl.zip`
- **Uniqueness**: Guaranteed by UUID v4 algorithm
- **Readability**: Hyphenated format for easy reading

### **SSL Certificate Strategy**
```
*.myl.zip → Wildcard SSL certificate (UUID subdomains)
├── abc123-def456-ghi789.myl.zip ✅ (covered by wildcard)
├── xyz789-uvw123-abc456.myl.zip ✅ (covered by wildcard)
└── any-uuid-subdomain.myl.zip ✅ (covered by wildcard)

api.myl.zip → Individual SSL certificate (API service)
custom.myl.zip → Individual SSL certificate (future vanity domains)
```

**Certificate Stacking:**
- **Google Cloud Run** automatically stacks multiple certificates
- **No conflicts** between wildcard and individual certificates
- **Optimal security** for each service type
- **Automatic renewal** for all certificates

### **DNS Configuration**
```
myl.zip → Google Cloud Run (main domain)
*.myl.zip → Google Cloud Run (wildcard subdomains)
api.myl.zip → Google Cloud Run (API service)
```

## 🔧 Implementation Details

### **Backend API Endpoints**

#### **1. Device Registration**
```http
POST /api/v1/device/register
Content-Type: application/json

{
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Windows",
    "browser": "Chrome"
  },
  "userPreferences": {
    "nickname": "Mom's Computer" // Optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "deviceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "subdomain": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.myl.zip",
  "apiKey": "sk_live_abc123def456ghi789...",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

#### **2. SSL Provisioning**
```http
POST /api/v1/ssl/provision
Content-Type: application/json

{
  "deviceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "subdomain": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.myl.zip"
}
```

**Response:**
```json
{
  "success": true,
  "sslStatus": "active",
  "certificateType": "wildcard",
  "expiresAt": "2025-01-15T23:59:59Z"
}
```

#### **3. API Key Generation**
```http
POST /api/v1/ssl/generate-extension-key
Content-Type: application/json

{
  "deviceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "subdomain": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.myl.zip"
}
```

**Response:**
```json
{
  "success": true,
  "apiKey": "sk_live_abc123def456ghi789...",
  "permissions": ["read", "write"],
  "rateLimit": "1000/hour",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### **Database Schema**

#### **Devices Table**
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY,
  subdomain VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100),
  user_agent TEXT,
  platform VARCHAR(50),
  browser VARCHAR(50),
  api_key VARCHAR(255) UNIQUE NOT NULL,
  ssl_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  last_active TIMESTAMP
);
```

#### **SSL Certificates Table**
```sql
CREATE TABLE ssl_certificates (
  id UUID PRIMARY KEY,
  subdomain VARCHAR(255) NOT NULL,
  certificate_type VARCHAR(20) DEFAULT 'wildcard',
  status VARCHAR(20) DEFAULT 'active',
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  renewed_at TIMESTAMP
);
```

## 🔄 Workflow

### **1. Device Registration**
```
User → Setup Wizard → api.myl.zip/device/register
↓
Backend generates UUID
↓
Backend creates subdomain record
↓
Backend generates API key
↓
Backend returns configuration
```

### **2. SSL Provisioning**
```
Backend → Google Cloud DNS → Create A record
↓
Backend → Google Cloud SSL → Verify wildcard certificate
↓
Backend → Database → Update SSL status
↓
Backend → User → SSL ready notification
```

### **3. Chrome Extension Setup**
```
Extension → api.myl.zip → Authenticate with deviceId
↓
Extension → Subdomain → Access user's content
↓
Extension → SSL verification → Confirm secure connection
↓
Extension → Ready for use
```

## 🔒 Security Considerations

### **UUID Security**
- **Randomness**: UUID v4 uses cryptographically secure random generation
- **Collision Resistance**: 2^122 possible combinations
- **Predictability**: Impossible to guess or enumerate
- **Expiration**: UUIDs expire after 30 days of inactivity

### **SSL Security**
- **Wildcard Certificate**: Covers all UUID subdomains automatically
- **Individual Certificates**: API and vanity domains get specific certificates
- **Certificate Stacking**: Google Cloud Run handles multiple certificates
- **Certificate Management**: Google Cloud Run handles renewal for all certificates
- **Encryption**: TLS 1.3 for all communications
- **Certificate Transparency**: All certificates logged
- **No Conflicts**: Wildcard and individual certificates work together

### **API Security**
- **Rate Limiting**: 1000 requests per hour per device
- **Authentication**: Device-based with API keys
- **Authorization**: Scoped permissions per device
- **Monitoring**: All API calls logged and monitored

## 📊 Monitoring & Analytics

### **Subdomain Usage**
- **Active Subdomains**: Count of currently active UUID subdomains
- **Registration Rate**: New device registrations per day
- **SSL Status**: Certificate health across all subdomains
- **Error Rates**: Failed SSL provisioning attempts

### **Performance Metrics**
- **DNS Resolution**: Time to resolve UUID subdomains
- **SSL Handshake**: Time to establish secure connections
- **API Response**: Backend API response times
- **Uptime**: Availability of subdomain services

## 🚀 Future Enhancements

### **Vanity Subdomains**
```
Current: abc123-def456-ghi789.myl.zip
Future: moms-computer.myl.zip
```

### **Custom Domains**
```
Current: abc123-def456-ghi789.myl.zip
Future: moms-computer.customdomain.com
```

### **Subdomain Management**
- **Dashboard**: User interface to manage subdomains
- **Renaming**: Change subdomain nicknames
- **Transfer**: Move subdomain to different device
- **Deletion**: Remove unused subdomains

## 💰 Cost Analysis

### **Current Costs**
- **Wildcard SSL**: ~$0/month (Google Cloud Run managed)
- **DNS Records**: ~$0/month (Google Cloud DNS)
- **Subdomain Hosting**: ~$0/month (Google Cloud Run)
- **Total**: No additional cost for UUID subdomains

### **Future Costs (Vanity Domains)**
- **Individual SSL**: ~$0/month (Let's Encrypt)
- **Custom Domains**: ~$15/year per domain
- **Premium Features**: ~$5/month per user

## 🎯 Benefits

### **For Users**
- ✅ **Zero Technical Knowledge Required**
- ✅ **Instant Setup** (no domain registration)
- ✅ **Automatic SSL** (no certificate management)
- ✅ **Unique Identity** (UUID-based subdomains)
- ✅ **Future-Proof** (vanity domains coming)

### **For Developers**
- ✅ **Simplified Onboarding** (no domain setup)
- ✅ **Reduced Support** (fewer technical issues)
- ✅ **Scalable Architecture** (unlimited subdomains)
- ✅ **Security Built-in** (wildcard SSL)
- ✅ **Analytics Ready** (usage tracking)

---

**Remember**: UUID subdomains make SSL provisioning invisible to users! 🚀
