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
        
        // Upload all files from src directory
        await client.uploadFromDir(localPath, {
            include: config.include,
            exclude: config.exclude
        });

        console.log('✅ All files uploaded successfully!');

        // List uploaded files
        console.log('\n📋 Uploaded files:');
        const files = await client.list();
        files.forEach(file => {
            if (file.isFile) {
                console.log(`   📄 ${file.name} (${file.size} bytes)`);
            }
        });

        // Test upload by checking if index.html exists
        const indexExists = files.some(file => file.name === 'index.html');
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
        console.log('🌐 Your site should be live at: https://myl.zip');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Deployment failed:', err.message);
        process.exit(1);
    });
