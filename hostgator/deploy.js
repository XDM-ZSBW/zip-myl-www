const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync('ftp-config.json', 'utf8'));

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable verbose logging

    try {
        console.log('[CONNECT] Connecting to Hostgator...');
        await client.access({
            host: config.host,
            user: config.username,
            password: config.password,
            port: config.port,
            secure: config.secure
        });

        console.log('[OK] Connected successfully!');
        console.log('[DIR] Current directory:', await client.pwd());

        // Navigate to remote directory
        console.log(`[NAV] Navigating to ${config.remotePath}...`);
        await client.ensureDir(config.remotePath);

        // Upload files
        console.log('[UPLOAD] Uploading files...');
        const localPath = path.resolve(config.localPath);
        
        // Upload files individually to avoid the error
        const files = fs.readdirSync(localPath);
        for (const file of files) {
            const localFilePath = path.join(localPath, file);
            const stats = fs.statSync(localFilePath);
            
            if (stats.isFile()) {
                console.log(`   [FILE] Uploading ${file}...`);
                await client.uploadFrom(localFilePath, file);
            } else if (stats.isDirectory()) {
                console.log(`   [DIR] Uploading directory ${file}...`);
                // Upload the directory contents to the current directory
                await client.uploadFromDir(localFilePath);
            }
        }

        console.log('[OK] All files uploaded successfully!');

        // List uploaded files
        console.log('\n[LIST] Uploaded files:');
        const uploadedFiles = await client.list();
        uploadedFiles.forEach(file => {
            if (file.isFile) {
                console.log(`   [FILE] ${file.name} (${file.size} bytes)`);
            }
        });

        // Test upload by checking if index.html exists
        const indexExists = uploadedFiles.some(file => file.name === 'index.html');
        if (indexExists) {
            console.log('\n[OK] index.html found - deployment looks good!');
        } else {
            console.log('\n[WARN] Warning: index.html not found in uploaded files');
        }

    } catch (err) {
        console.error('[ERROR] Deployment failed:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// Run deployment
deploy()
    .then(() => {
        console.log('\n[SUCCESS] Deployment completed successfully!');
        console.log('[URL] Your staging site should be live at: https://zaido.org');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n[FAILED] Deployment failed:', err.message);
        process.exit(1);
    });
