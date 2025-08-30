const ftp = require('basic-ftp');
const fs = require('fs');

// Load configuration
const config = JSON.parse(fs.readFileSync('ftp-config.json', 'utf8'));

async function checkDirectories() {
    const client = new ftp.Client();
    client.ftp.verbose = false; // Reduce verbose output

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
        
        // Navigate to public_html
        console.log('\n📂 Checking public_html directory...');
        await client.cd('/public_html');
        
        // List all directories
        const items = await client.list();
        console.log('\n📋 Contents of /public_html:');
        items.forEach(item => {
            const type = item.isDirectory ? '📁' : '📄';
            const permissions = item.raw ? (item.raw.match(/[drwx-]{10}/)?.[0] || 'unknown') : 'unknown';
            console.log(`   ${type} ${item.name} (${permissions})`);
        });
        
        // Check if website_1a41642e exists and has our files
        console.log('\n📂 Checking website_1a41642e directory...');
        await client.cd('/public_html/website_1a41642e');
        
        const websiteFiles = await client.list();
        console.log('\n📋 Contents of /public_html/website_1a41642e:');
        websiteFiles.forEach(file => {
            const type = file.isDirectory ? '📁' : '📄';
            console.log(`   ${type} ${file.name} (${file.size} bytes)`);
        });
        
        // Check for index.html specifically
        const hasIndex = websiteFiles.some(file => file.name === 'index.html');
        console.log(`\n✅ index.html found: ${hasIndex ? 'Yes' : 'No'}`);
        
        // Check what's in the root public_html
        console.log('\n📂 Checking root public_html for index.html...');
        await client.cd('/public_html');
        const rootFiles = await client.list();
        const rootIndex = rootFiles.find(file => file.name === 'index.html');
        if (rootIndex) {
            console.log(`⚠️  Found index.html in root public_html (${rootIndex.size} bytes)`);
            console.log('   This might be causing the 403 error - domain is pointing to root, not subdirectory');
        }
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// Run check
checkDirectories()
    .then(() => {
        console.log('\n✅ Directory check completed!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Directory check failed!');
        process.exit(1);
    });
