const https = require('https');
const http = require('http');

async function testSSLDomain() {
    console.log('🌐 Testing SSL certificate domain access...\n');
    
    const urls = [
        'https://website-1a41642e.lwa.vhb.temporary.site',
        'http://website-1a41642e.lwa.vhb.temporary.site',
        'https://www.website-1a41642e.lwa.vhb.temporary.site',
        'http://www.website-1a41642e.lwa.vhb.temporary.site'
    ];
    
    for (const url of urls) {
        try {
            console.log(`🔍 Testing: ${url}`);
            
            const response = await new Promise((resolve, reject) => {
                const protocol = url.startsWith('https') ? https : http;
                const req = protocol.get(url, { 
                    timeout: 10000,
                    rejectUnauthorized: false // Allow self-signed certificates
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
                });
                req.on('error', reject);
                req.on('timeout', () => reject(new Error('Timeout')));
            });
            
            console.log(`   ✅ Status: ${response.status}`);
            console.log(`   📄 Content-Type: ${response.headers['content-type'] || 'unknown'}`);
            console.log(`   📊 Size: ${response.data.length} bytes`);
            
            if (response.data.includes('Zip MyL')) {
                console.log(`   🎯 Found Zip MyL content!`);
            }
            
            if (response.data.includes('403')) {
                console.log(`   ⚠️  Found 403 error content`);
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        console.log('');
    }
}

// Run test
testSSLDomain()
    .then(() => {
        console.log('✅ SSL domain test completed!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('💥 SSL domain test failed:', err.message);
        process.exit(1);
    });
