const ftp = require('basic-ftp');
const fs = require('fs');

// Load configuration
const config = JSON.parse(fs.readFileSync('ftp-config.json', 'utf8'));

async function testConnection() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔌 Testing connection to Hostgator...');
        console.log(`📡 Host: ${config.host}`);
        console.log(`👤 Username: ${config.username}`);
        console.log(`🔒 Port: ${config.port}`);
        console.log(`🔐 Secure: ${config.secure}`);
        console.log('');

        await client.access({
            host: config.host,
            user: config.username,
            password: config.password,
            port: config.port,
            secure: config.secure
        });

        console.log('✅ Connection successful!');
        console.log('📁 Current directory:', await client.pwd());

        // List files in current directory
        console.log('\n📋 Files in current directory:');
        const files = await client.list();
        files.forEach(file => {
            const type = file.isDirectory ? '📁' : '📄';
            console.log(`   ${type} ${file.name}`);
        });

        // Test navigation to remote path
        console.log(`\n📂 Testing navigation to ${config.remotePath}...`);
        await client.ensureDir(config.remotePath);
        console.log('✅ Navigation successful!');

        console.log('\n🎉 All tests passed! Your FTP credentials are working correctly.');
        console.log('💡 You can now run deploy.bat to deploy your site.');

    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('   1. Check your FTP credentials in ftp-config.json');
        console.log('   2. Verify your Hostgator account is active');
        console.log('   3. Check if FTP is enabled in your Hostgator control panel');
        console.log('   4. Try using a different FTP client to test manually');
        throw err;
    } finally {
        client.close();
    }
}

// Run test
testConnection()
    .then(() => {
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Connection test failed!');
        process.exit(1);
    });
