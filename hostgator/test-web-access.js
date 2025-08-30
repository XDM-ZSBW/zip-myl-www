const https = require('https');
const http = require('http');

async function testWebAccess() {
    console.log('🌐 Testing web access to zaido.org...\n');
    
    const urls = [
        'http://zaido.org',
        'https://zaido.org',
        'http://zaido.org/website_1a41642e',
        'https://zaido.org/website_1a41642e',
        'http://zaido.org/index.html',
        'https://zaido.org/index.html'
    ];
    
    for (const url of urls) {
        try {
            console.log(`🔍 Testing: ${url}`);
            
            const response = await new Promise((resolve, reject) => {
                const protocol = url.startsWith('https') ? https : http;
                const req = protocol.get(url, { timeout: 10000 }, (res) => {
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
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        console.log('');
    }
}

// Run test
testWebAccess()
    .then(() => {
        console.log('✅ Web access test completed!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('💥 Web access test failed:', err.message);
        process.exit(1);
    });
