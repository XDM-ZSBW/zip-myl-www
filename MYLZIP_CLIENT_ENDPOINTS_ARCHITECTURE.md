# MyL.Zip Client Endpoints Architecture

## Overview

This document describes the updated architecture where `myl.zip` serves its own client endpoints while maintaining a transparent proxy for www/root domain content.

## Architecture Changes

### Before (Full Proxy)
- `myl.zip` → Transparent proxy to `zaido.org`
- All requests proxied to staging environment
- No local content served

### After (Hybrid Architecture)
- `myl.zip` → Serves local client endpoints + proxies www content
- Client endpoints served locally from Cloud Run
- Main www content proxied to `zaido.org`

## Client Endpoints Served Locally

### Authentication Endpoints
- `/auth` - Device authentication page
- `/setup-wizard.html` - Device setup wizard
- `/api/*` - API endpoints (handled by backend)

### Static Assets
- `/css/*` - Stylesheets
- `/js/*` - JavaScript files
- `/assets/*` - Images and other assets

## Proxy Endpoints

### Main Content (Proxied to zaido.org)
- `/` - Main homepage
- `/about` - About pages
- `/help` - Help documentation
- Any other www content

## Nginx Configuration

The nginx configuration now uses location-based routing:

```nginx
# Serve local content for authentication and setup endpoints
location ~ ^/(auth|setup-wizard\.html|api/.*) {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle HTML files
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
    }
}

# Transparent proxy to zaido.org (staging) for main www content
location / {
    proxy_pass https://zaido.org;
    proxy_set_header Host zaido.org;
    # ... other proxy settings
}
```

## Chrome Extension Integration

### Authentication Flow
1. User clicks "Verify Device" in extension
2. Extension opens `https://myl.zip/auth?deviceId=...`
3. `myl.zip` serves local authentication page
4. Authentication page communicates with `api.myl.zip`
5. Device verification completed

### Setup Wizard Flow
1. User clicks "Setup Wizard" in authentication page
2. Redirects to `https://myl.zip/setup-wizard.html?deviceId=...`
3. `myl.zip` serves local setup wizard
4. Wizard communicates with `api.myl.zip` for SSL provisioning
5. API key generation and device setup completed

## Benefits

### 1. Consistent Client Experience
- All client endpoints remain on `myl.zip`
- No domain switching for users
- Maintains brand consistency

### 2. Independent Development
- Client endpoints can be developed independently
- Staging environment for www content
- Faster iteration cycles

### 3. Security
- Client endpoints served from trusted domain
- API communication remains secure
- No cross-domain authentication issues

### 4. Performance
- Local serving of client endpoints
- Reduced latency for authentication flows
- Better caching control

## File Structure

```
zip-myl-www/
├── src/
│   ├── index.html              # Proxy fallback
│   ├── auth.html              # Authentication page
│   ├── setup-wizard.html      # Setup wizard
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   └── setup-wizard.css   # Wizard styles
│   └── js/
│       └── setup-wizard.js    # Wizard functionality
├── nginx.conf                 # Hybrid routing config
└── Dockerfile                 # Builds with local content
```

## Deployment

### Cloud Run Service
- Builds Docker image with local content
- Serves client endpoints locally
- Proxies www content to staging

### Staging Environment
- `zaido.org` serves main www content
- Independent from client endpoints
- Can be updated without affecting client functionality

## Testing

### Client Endpoints
- Visit `https://myl.zip/auth?deviceId=test123`
- Should show local authentication page
- Should communicate with `api.myl.zip`

### Proxy Content
- Visit `https://myl.zip/`
- Should show proxied content from `zaido.org`
- Should maintain `myl.zip` URL

### Extension Integration
- Load Chrome extension
- Click "Verify Device"
- Should open `myl.zip/auth` page
- Should complete authentication flow

## Future Enhancements

### 1. Dynamic Content Fetching
- Cloud Run service could fetch content from staging
- Cache content locally for performance
- Fallback to local content if staging unavailable

### 2. A/B Testing
- Serve different client endpoints based on user segment
- Test new features on subset of users
- Gradual rollout capabilities

### 3. Multi-Environment Support
- Support for multiple staging environments
- Environment-specific configurations
- Easy switching between environments

## Troubleshooting

### Common Issues

1. **Client endpoints not loading**
   - Check nginx configuration
   - Verify files are copied to Docker image
   - Check Cloud Run logs

2. **Proxy not working**
   - Verify `zaido.org` is accessible
   - Check proxy settings in nginx
   - Test direct access to staging

3. **Extension communication issues**
   - Verify CORS settings
   - Check API endpoint availability
   - Test authentication flow manually

### Debug Commands

```bash
# Test local endpoint
curl -I https://myl.zip/auth

# Test proxy endpoint
curl -I https://myl.zip/

# Check Cloud Run logs
gcloud run services logs read zip-myl-www --region us-central1
```
