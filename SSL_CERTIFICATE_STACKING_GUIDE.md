# 🔐 SSL Certificate Stacking Implementation Guide

## 📋 Overview

This guide explains how to implement SSL certificate stacking in Google Cloud Run to handle multiple certificate types for different subdomain patterns.

## 🏗️ Certificate Architecture

### **Certificate Types**
```
1. Wildcard Certificate: *.myl.zip
   - Covers: abc123-def456-ghi789.myl.zip
   - Covers: xyz789-uvw123-abc456.myl.zip
   - Covers: any-uuid-pattern.myl.zip

2. Individual Certificate: api.myl.zip
   - Covers: api.myl.zip only
   - Specific security policies

3. Individual Certificate: custom.myl.zip (future)
   - Covers: custom.myl.zip only
   - For vanity domains
```

## 🔧 Google Cloud Run Implementation

### **1. Wildcard Certificate Setup**
```bash
# Create wildcard certificate for UUID subdomains
gcloud compute ssl-certificates create wildcard-myl-zip \
  --global \
  --managed \
  --domains="*.myl.zip"
```

### **2. Individual Certificate Setup**
```bash
# Create individual certificate for API
gcloud compute ssl-certificates create api-myl-zip \
  --global \
  --managed \
  --domains="api.myl.zip"

# Create individual certificate for vanity domains (future)
gcloud compute ssl-certificates create custom-myl-zip \
  --global \
  --managed \
  --domains="custom.myl.zip"
```

### **3. Cloud Run Service Configuration**
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/zip-myl-backend', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/zip-myl-backend']
  
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'zip-myl-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/zip-myl-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'ENVIRONMENT=production'
      - '--domain'
      - 'api.myl.zip'
      - '--domain'
      - '*.myl.zip'
```

## 🔄 Certificate Stacking Logic

### **How Google Cloud Run Handles Multiple Certificates**

1. **Certificate Matching**: Cloud Run matches the most specific certificate
2. **Fallback**: Falls back to wildcard certificate if no specific match
3. **Automatic Selection**: No manual configuration needed
4. **Renewal**: All certificates renewed automatically

### **Certificate Priority**
```
1. api.myl.zip → Individual certificate (highest priority)
2. custom.myl.zip → Individual certificate (when created)
3. *.myl.zip → Wildcard certificate (fallback for UUID subdomains)
```

## 🛡️ Security Considerations

### **Wildcard Certificate Security**
- **Scope**: Only covers UUID subdomains
- **Isolation**: API and vanity domains use separate certificates
- **Compromise Impact**: Limited to UUID subdomains only
- **Monitoring**: Track wildcard certificate usage

### **Individual Certificate Security**
- **API Certificate**: Stricter security policies
- **Vanity Certificate**: Custom security requirements
- **Isolation**: Each service has independent security
- **Monitoring**: Track individual certificate health

## 📊 Monitoring & Alerting

### **Certificate Health Monitoring**
```javascript
// Monitor certificate status
const certificates = [
  'wildcard-myl-zip',
  'api-myl-zip',
  'custom-myl-zip'
];

certificates.forEach(cert => {
  // Check certificate expiration
  // Monitor certificate usage
  // Alert on certificate issues
});
```

### **Subdomain Certificate Mapping**
```javascript
// Track which certificate covers which subdomain
const certificateMapping = {
  'api.myl.zip': 'api-myl-zip',
  'custom.myl.zip': 'custom-myl-zip',
  'abc123-def456-ghi789.myl.zip': 'wildcard-myl-zip',
  'xyz789-uvw123-abc456.myl.zip': 'wildcard-myl-zip'
};
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Certificate Conflicts**
```bash
# Check certificate status
gcloud compute ssl-certificates list

# Verify certificate domains
gcloud compute ssl-certificates describe wildcard-myl-zip
```

#### **2. Subdomain Not Secured**
```bash
# Test SSL connection
curl -I https://abc123-def456-ghi789.myl.zip

# Check DNS resolution
nslookup abc123-def456-ghi789.myl.zip
```

#### **3. Certificate Not Renewing**
```bash
# Check certificate expiration
gcloud compute ssl-certificates describe wildcard-myl-zip \
  --format="value(expireTime)"

# Force certificate renewal
gcloud compute ssl-certificates update wildcard-myl-zip \
  --managed
```

## 🔄 Implementation Workflow

### **Phase 1: Wildcard Certificate**
1. **Create wildcard certificate** for `*.myl.zip`
2. **Test UUID subdomains** with wildcard certificate
3. **Monitor certificate health** and renewal
4. **Document certificate usage**

### **Phase 2: API Certificate**
1. **Create individual certificate** for `api.myl.zip`
2. **Configure API service** with individual certificate
3. **Test API endpoints** with new certificate
4. **Monitor API certificate** separately

### **Phase 3: Vanity Certificate (Future)**
1. **Create individual certificate** for `custom.myl.zip`
2. **Configure vanity domain** service
3. **Test vanity domains** with individual certificate
4. **Monitor vanity certificate** health

## 💰 Cost Analysis

### **Certificate Costs**
- **Wildcard Certificate**: ~$0/month (Google Cloud Run managed)
- **Individual Certificates**: ~$0/month (Google Cloud Run managed)
- **Total**: No additional SSL costs

### **Management Costs**
- **Certificate Monitoring**: ~$0/month (built-in)
- **Renewal Automation**: ~$0/month (automatic)
- **Total**: Zero additional management costs

## 🎯 Benefits

### **Security Benefits**
- ✅ **Granular Control**: Each service type gets optimal certificate
- ✅ **Isolation**: Compromise of one certificate doesn't affect others
- ✅ **Flexibility**: Different security policies per service
- ✅ **Monitoring**: Independent certificate health tracking

### **Operational Benefits**
- ✅ **Automatic Stacking**: Google Cloud Run handles certificate selection
- ✅ **No Conflicts**: Wildcard and individual certificates work together
- ✅ **Easy Management**: Single interface for all certificates
- ✅ **Future-Proof**: Easy to add new certificate types

---

**Remember**: Certificate stacking provides optimal security for each service type! 🔐
