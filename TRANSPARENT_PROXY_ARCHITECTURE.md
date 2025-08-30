# Transparent Proxy Architecture

## Overview

The `myl.zip` production domain now acts as a transparent proxy layer that forwards all requests to `zaido.org` (staging environment). This architecture provides:

- **Separation of concerns**: Production domain serves as a transparent layer
- **Flexibility**: Easy to switch staging environments or add production-specific logic
- **Consistency**: Users always see the same content regardless of domain
- **Scalability**: Staging can be updated independently

## Architecture Components

### 1. myl.zip (Production - Cloud Run)
- **Purpose**: Transparent proxy layer
- **Technology**: Nginx on Cloud Run
- **Function**: Forwards all requests to zaido.org
- **Fallback**: Serves redirect page if proxy fails

### 2. zaido.org (Staging - Hostgator)
- **Purpose**: Actual content and functionality
- **Technology**: Static files on Hostgator
- **Function**: Serves the real application content
- **Deployment**: FTP-based CI/CD

### 3. api.myl.zip (Backend - Cloud Run)
- **Purpose**: Shared backend API
- **Technology**: Node.js on Cloud Run
- **Function**: Provides API services for both domains
- **CORS**: Configured to allow both myl.zip and zaido.org

## Request Flow

```
User Request → myl.zip → Proxy → zaido.org → Response
     ↓
Backend API calls → api.myl.zip
```

## Configuration Details

### Nginx Proxy Configuration
- **Proxy Pass**: `https://zaido.org`
- **Header Preservation**: Maintains original request headers
- **Redirect Handling**: Converts zaido.org URLs to myl.zip
- **Timeout**: 30-second connection timeout
- **Security**: Standard security headers

### Fallback Mechanism
- **Primary**: Transparent proxy to zaido.org
- **Fallback**: HTML redirect page if proxy fails
- **Health Check**: `/health` endpoint for monitoring

## Benefits

1. **Clean Architecture**: Production domain is purely a proxy
2. **Easy Updates**: Staging can be updated without touching production
3. **A/B Testing**: Can easily switch between different staging environments
4. **Monitoring**: Can add production-specific monitoring/logging
5. **Security**: Can add production-specific security measures

## Deployment

### Production (myl.zip)
```bash
# Deploy to Cloud Run via GitHub Actions
git push origin main
```

### Staging (zaido.org)
```bash
# Deploy via FTP
cd hostgator
./deploy.bat
```

## Future Enhancements

1. **Caching Layer**: Add Redis caching for better performance
2. **Load Balancing**: Multiple staging environments
3. **Blue-Green Deployment**: Seamless staging-to-production promotion
4. **Analytics**: Production-specific tracking
5. **Rate Limiting**: Production-specific rate limiting

## Monitoring

- **Health Check**: `https://myl.zip/health`
- **Proxy Status**: Monitor proxy connection to zaido.org
- **Performance**: Track proxy response times
- **Errors**: Monitor proxy failures and fallbacks
