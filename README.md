# ZIP-MYL-WWW

Web application with automated Google Cloud Run deployment system.

## 🚀 Quick Start

### Prerequisites
- Google Cloud account with Cloud Run enabled
- GitHub repository connected to Cloud Run
- Docker installed (for local testing)

### Installation

1. **Connect GitHub Repository:**
   - Go to [Google Cloud Run Console](https://console.cloud.google.com/run?project=zip-myl-www)
   - Click "Create Service"
   - Select "Continuously deploy from a Git repository"
   - Connect your GitHub repository: `https://github.com/XDM-ZSBW/zip-myl-www`

2. **Configure Deployment:**
   - Service name: `zip-myl-www`
   - Region: `us-central1`
   - Branch: `main`
   - Build configuration: Use `cloudbuild.yaml`

3. **Automatic Deployment:**
   - Every commit to `main` branch triggers automatic deployment
   - No manual deployment needed

## 📁 Project Structure

```
├── .gitignore          # Git ignore patterns
├── .dockerignore       # Docker build ignore patterns
├── Dockerfile          # Container configuration
├── nginx.conf          # Nginx server configuration
├── cloudbuild.yaml     # Cloud Build configuration
├── package.json        # Node.js dependencies and scripts
├── README.md           # This file
├── CLOUD_RUN_SETUP.md  # Detailed setup guide
└── src/               # Web application source files
    ├── index.html     # Main HTML file
    ├── css/           # Stylesheets
    │   └── style.css  # Main styles
    └── js/            # JavaScript files
        └── main.js    # Main script
```

## ⚙️ Configuration

### Cloud Build Configuration (`cloudbuild.yaml`)

The `cloudbuild.yaml` file defines the automated build and deployment process:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/$_SERVICE_NAME:$COMMIT_SHA', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/$_SERVICE_NAME:$COMMIT_SHA']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - '$_SERVICE_NAME'
      - '--image'
      - 'gcr.io/$PROJECT_ID/$_SERVICE_NAME:$COMMIT_SHA'
      - '--region'
      - '$_REGION'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '8080'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--max-instances'
      - '10'
      - '--min-instances'
      - '0'
```

## 🔧 Available Scripts

- `npm run start` - Service runs on Google Cloud Run
- `npm run build` - Build handled by Cloud Build
- `npm run test` - Add your test command here
- `npm run dev` - For local development, open src/index.html in your browser

## 📋 Ignore Files

### `.gitignore`
Contains patterns for files that should not be tracked by Git:
- Dependencies (`node_modules/`)
- Build outputs (`dist/`, `build/`)
- Environment files (`.env*`)
- IDE files (`.vscode/`, `.idea/`)
- Logs and temporary files

### `.dockerignore`
Contains patterns for files that should not be included in Docker builds:
- Git and version control files
- Documentation files
- Development and build tools
- Testing files
- OS generated files

## 🔒 Security Features

- **HTTPS by default** - All traffic encrypted
- **Security headers** - XSS protection, content type validation
- **Minimal permissions** - Service runs with least privilege
- **No authentication required** - Public service for static content
- **Automatic scaling** - Handles traffic spikes securely

## 🚨 Troubleshooting

### Common Issues

1. **Build failed**
   - Check Cloud Build logs in Google Cloud Console
   - Verify Dockerfile syntax
   - Ensure all required files are present

2. **Service not accessible**
   - Check Cloud Run service status
   - Verify service is deployed to correct region
   - Check service logs for errors

3. **Deployment not triggered**
   - Verify GitHub repository connection
   - Check branch name matches configuration
   - Ensure Cloud Build API is enabled

### Debug Mode

- View detailed logs in Cloud Run console
- Check Cloud Build history for build issues
- Monitor service metrics in Cloud Monitoring

## 📝 Deployment Process

1. **Commit to GitHub** - Push changes to `main` branch
2. **Cloud Build Trigger** - Automatically starts build process
3. **Docker Build** - Creates container image from source
4. **Container Registry** - Stores image for deployment
5. **Cloud Run Deploy** - Updates service with new image
6. **Service Update** - New version goes live automatically

## 🌐 Service URL

After deployment, your service will be available at:
```
https://zip-myl-www-[hash]-uc.a.run.app
```

## 📊 Monitoring

- **Cloud Run Console** - View service logs and metrics
- **Cloud Monitoring** - Set up alerts and dashboards
- **Cloud Logging** - Detailed request and error logs

## 🔄 Backup System

- **Automatic rollback** - Failed deployments automatically rollback
- **Version history** - Previous versions remain available
- **Zero downtime** - Rolling deployments ensure availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready for Cloud Run deployment!** Follow the setup guide in `CLOUD_RUN_SETUP.md` to connect your repository.
