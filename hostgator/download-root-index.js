const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync('ftp-config.json', 'utf8'));

async function downloadRootIndex() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

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
        
        // Navigate to public_html root
        console.log('\n📂 Downloading root index.html...');
        await client.cd('/public_html');
        
        // Download the root index.html
        const tempFile = path.join(__dirname, 'temp-root-index.html');
        await client.downloadTo(tempFile, 'index.html');
        
        // Read and display the content
        const content = fs.readFileSync(tempFile, 'utf8');
        console.log('\n📄 Root index.html content:');
        console.log('=' .repeat(50));
        console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
        console.log('=' .repeat(50));
        console.log(`\n📊 File size: ${content.length} characters`);
        
        // Clean up
        fs.unlinkSync(tempFile);
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// Run download
downloadRootIndex()
    .then(() => {
        console.log('\n✅ Root index.html check completed!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Root index.html check failed!');
        process.exit(1);
    });
