const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function deployToHostGator() {
    const config = JSON.parse(fs.readFileSync('ftp-config.json', 'utf8'));
    const client = new ftp.Client();
    
    try {
        console.log('🚀 Starting HostGator deployment...');
        console.log(`📁 Local path: ${config.localPath}`);
        console.log(`🌐 Remote path: ${config.remotePath}`);
        
        await client.access({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port,
            secure: config.secure
        });
        
        console.log('✅ Connected to HostGator FTP');
        
        // Create backup if enabled
        if (config.createBackup) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = `${config.remotePath}_backup_${timestamp}`;
            try {
                await client.ensureDir(backupPath);
                await client.copyDir(config.remotePath, backupPath);
                console.log(`✅ Backup created: ${backupPath}`);
            } catch (error) {
                console.log('⚠️ Backup failed (may not exist yet):', error.message);
            }
        }
        
        // Upload files
        await client.uploadFromDir(config.localPath, config.remotePath);
        console.log('✅ Files uploaded successfully');
        
        // List uploaded files
        const files = await client.list(config.remotePath);
        console.log(`📋 Uploaded ${files.length} files:`);
        files.forEach(file => {
            console.log(`  - ${file.name} (${file.size} bytes)`);
        });
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

deployToHostGator();
