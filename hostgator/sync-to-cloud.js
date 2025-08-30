const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function syncToCloud() {
    try {
        console.log('🔄 Syncing Hostgator changes to Google Cloud Run...');
        console.log('📝 This will commit and push changes to trigger Cloud Run deployment');
        console.log('');

        // Check if we're in a git repository
        try {
            execSync('git status', { stdio: 'pipe' });
        } catch (err) {
            console.error('❌ Not in a git repository. Please run this from the zip-myl-www directory.');
            return;
        }

        // Check for changes
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (!status.trim()) {
            console.log('ℹ️  No changes detected. Everything is up to date.');
            return;
        }

        console.log('📋 Changes detected:');
        console.log(status);

        // Add all changes
        console.log('📦 Adding changes to git...');
        execSync('git add .', { stdio: 'inherit' });

        // Commit changes
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const commitMessage = `Sync from Hostgator - ${timestamp}`;
        console.log(`💾 Committing changes: ${commitMessage}`);
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

        // Push to GitHub
        console.log('🚀 Pushing to GitHub...');
        execSync('git push origin main', { stdio: 'inherit' });

        console.log('');
        console.log('✅ Sync completed successfully!');
        console.log('🌐 Cloud Run will automatically deploy the changes.');
        console.log('⏱️  Deployment typically takes 2-5 minutes.');
        console.log('');
        console.log('📊 Monitor deployment at:');
        console.log('   https://console.cloud.google.com/run');

    } catch (err) {
        console.error('❌ Sync failed:', err.message);
        throw err;
    }
}

// Run sync
syncToCloud()
    .then(() => {
        console.log('🎉 Sync to Cloud Run completed!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('💥 Sync to Cloud Run failed!');
        process.exit(1);
    });
