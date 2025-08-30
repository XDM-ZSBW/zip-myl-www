const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync('ftp-config.json', 'utf8'));

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable verbose logging

    try {
        console.log('🔌 Connecting to Hostgator...');
        await client.access({
            host: config.host,
            user: config.username,
            password: config.password,
            port: config.port,
            secure: config.secure
        });

        console.log('✅ Connected successfully!');
        console.log('📁 Current directory:', await client.pwd());

        // Navigate to remote directory
        console.log(`📂 Navigating to ${config.remotePath}...`);
        await client.ensureDir(config.remotePath);

        // Upload files
        console.log('📤 Uploading files...');
        const localPath = path.resolve(config.localPath);
        
        // Upload files individually to avoid the error
        const files = fs.readdirSync(localPath);
        for (const file of files) {
            const localFilePath = path.join(localPath, file);
            const stats = fs.statSync(localFilePath);
            
            if (stats.isFile()) {
                console.log(`   📄 Uploading ${file}...`);
                await client.uploadFrom(localFilePath, file);
            } else if (stats.isDirectory()) {
                console.log(`   📁 Uploading directory ${file}...`);
                await client.uploadFromDir(localFilePath);
            }
        }

        console.log('✅ All files uploaded successfully!');

        // List uploaded files
        console.log('\n📋 Uploaded files:');
        const uploadedFiles = await client.list();
        uploadedFiles.forEach(file => {
            if (file.isFile) {
                console.log(`   📄 ${file.name} (${file.size} bytes)`);
            }
        });

        // Test upload by checking if index.html exists
        const indexExists = uploadedFiles.some(file => file.name === 'index.html');
        if (indexExists) {
            console.log('\n✅ index.html found - deployment looks good!');
        } else {
            console.log('\n⚠️  Warning: index.html not found in uploaded files');
        }

    } catch (err) {
        console.error('❌ Deployment failed:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// Run deployment
deploy()
    .then(() => {
        console.log('\n🎉 Deployment completed successfully!');
        console.log('🌐 Your staging site should be live at: https://stage.myl.zip');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Deployment failed:', err.message);
        process.exit(1);
    });
