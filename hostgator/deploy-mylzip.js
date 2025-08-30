const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Configuration for myl.zip deployment
const config = {
    host: 'zaido.org',
    username: 'zaidoftp@zaido.org',
    password: '9N9HNK6xoZ5I',
    port: 21,
    secure: 'explicit',
    localPath: './staging-deploy',
    remotePath: '/public_html/website_0f1108f2'
};

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('[CONNECT] Connecting to Hostgator for myl.zip deployment...');
        await client.access({
            host: config.host,
            user: config.username,
            password: config.password,
            port: config.port,
            secure: config.secure
        });

        console.log('[OK] Connected successfully!');
        console.log('[DIR] Current directory:', await client.pwd());

        // Navigate to myl.zip directory
        console.log(`[NAV] Navigating to ${config.remotePath}...`);
        await client.ensureDir(config.remotePath);
        await client.cd(config.remotePath);

        // Upload files
        console.log('[UPLOAD] Uploading files to myl.zip directory...');
        const localPath = path.resolve(config.localPath);
        
        const files = fs.readdirSync(localPath);
        for (const file of files) {
            const localFilePath = path.join(localPath, file);
            const stats = fs.statSync(localFilePath);
            
            if (stats.isFile()) {
                console.log(`   [FILE] Uploading ${file}...`);
                await client.uploadFrom(localFilePath, file);
            } else if (stats.isDirectory()) {
                console.log(`   [DIR] Uploading directory ${file}...`);
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

        const indexExists = uploadedFiles.some(file => file.name === 'index.html');
        if (indexExists) {
            console.log('\n[OK] index.html found - myl.zip deployment looks good!');
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
        console.log('\n[SUCCESS] myl.zip deployment completed successfully!');
        console.log('[URL] Your site should be live at: https://myl.zip');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n[FAILED] Deployment failed:', err.message);
        process.exit(1);
    });
