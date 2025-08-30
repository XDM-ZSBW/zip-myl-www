const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function buildStaging() {
    console.log(chalk.blue('🔧 Building staging environment...'));
    
    try {
        // Create staging deployment directory
        const stagingDir = path.join(__dirname, '..', 'hostgator', 'staging-deploy');
        await fs.ensureDir(stagingDir);
        
        // Copy staging content to deployment directory
        const stagingSource = path.join(__dirname, '..', 'staging');
        await fs.copy(stagingSource, stagingDir);
        
        // Copy shared components
        const sharedDir = path.join(__dirname, '..', 'shared');
        if (await fs.pathExists(sharedDir)) {
            await fs.copy(sharedDir, stagingDir, { overwrite: true });
        }
        
        // Update FTP config to point to staging deployment
        const ftpConfigPath = path.join(__dirname, '..', 'hostgator', 'ftp-config.json');
        const ftpConfig = await fs.readJson(ftpConfigPath);
        ftpConfig.localPath = './staging-deploy';
        await fs.writeJson(ftpConfigPath, ftpConfig, { spaces: 2 });
        
        console.log(chalk.green('✅ Staging build completed!'));
        console.log(chalk.yellow('📁 Staging files ready in: hostgator/staging-deploy/'));
        console.log(chalk.cyan('🚀 Deploy with: npm run deploy:staging'));
        
    } catch (error) {
        console.error(chalk.red('❌ Staging build failed:'), error.message);
        process.exit(1);
    }
}

buildStaging();
