# ZIP-MYL-WWW Project Structure

## 📁 Directory Layout

```
zip-myl-www/
├── 📁 src/                    # Web application source files
│   ├── 📄 index.html         # Main HTML entry point
│   ├── 📁 css/              # Stylesheets
│   │   └── 📄 style.css     # Main CSS styles
│   └── 📁 js/               # JavaScript files
│       └── 📄 main.js       # Main JavaScript functionality
│
├── 📄 .gitignore            # Git ignore patterns
├── 📄 .mylzipignore         # myl.zip deployment ignore patterns
├── 📄 ftp-config.json       # FTP configuration (credentials)
├── 📄 ftp-deploy.js         # Main FTP deployment script
├── 📄 package.json          # Node.js dependencies and scripts
├── 📄 env-template.txt      # Environment variables template
├── 📄 deploy.bat            # Windows deployment script
├── 📄 deploy-secure.bat     # Secure interactive deployment
├── 📄 README.md             # Main documentation
└── 📄 PROJECT_STRUCTURE.md  # This file
```

## 🚀 Deployment Flow

1. **Development**: Edit files in the `src/` folder
2. **Deployment**: Run `deploy-secure.bat` or `npm run deploy`
3. **Upload**: Files from `src/` are uploaded to `/html` folder on myl.zip
4. **Ignore**: Files listed in `.mylzipignore` are excluded from deployment

## 📋 File Purposes

### Source Files (`src/`)
- **`index.html`**: Main web page entry point
- **`css/style.css`**: All styling and responsive design
- **`js/main.js`**: JavaScript functionality and interactions

### Configuration Files
- **`.mylzipignore`**: Specifies files NOT to deploy to myl.zip
- **`ftp-config.json`**: FTP server settings (host: myl.zip, path: /html)
- **`env-template.txt`**: Template for secure credential storage

### Deployment Scripts
- **`deploy-secure.bat`**: Interactive deployment with credential prompts
- **`deploy.bat`**: Standard deployment using config file
- **`ftp-deploy.js`**: Main deployment logic with backup support

### Documentation
- **`README.md`**: Complete setup and usage guide
- **`PROJECT_STRUCTURE.md`**: This file explaining the structure

## 🔒 Security Features

1. **Environment Variables**: Store credentials in `.env` file (not committed)
2. **Interactive Deployment**: Enter credentials at runtime (most secure)
3. **Ignore Patterns**: Prevent sensitive files from being uploaded
4. **Backup System**: Automatic backups before each deployment

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Deploy to myl.zip
deploy-secure.bat
```

The system will prompt for your FTP credentials and deploy the `src/` folder to the `/html` directory on myl.zip.
