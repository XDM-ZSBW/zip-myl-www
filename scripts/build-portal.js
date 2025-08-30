const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function buildPortal() {
    console.log(chalk.blue('🌐 Building portal environment...'));
    
    try {
        // Create portal deployment directory
        const portalDir = path.join(__dirname, '..', 'src');
        await fs.ensureDir(portalDir);
        
        // Copy portal content to deployment directory
        const portalSource = path.join(__dirname, '..', 'portal');
        await fs.copy(portalSource, portalDir, { overwrite: true });
        
        // Copy shared components
        const sharedDir = path.join(__dirname, '..', 'shared');
        if (await fs.pathExists(sharedDir)) {
            await fs.copy(sharedDir, portalDir, { overwrite: true });
        }
        
        // Add portal-specific optimizations
        await addPortalOptimizations(portalDir);
        
        console.log(chalk.green('✅ Portal build completed!'));
        console.log(chalk.yellow('📁 Portal files ready in: src/'));
        console.log(chalk.cyan('🚀 Deploy with: npm run deploy:portal'));
        
    } catch (error) {
        console.error(chalk.red('❌ Portal build failed:'), error.message);
        process.exit(1);
    }
}

async function addPortalOptimizations(portalDir) {
    // Add portal-specific meta tags and optimizations
    const indexPath = path.join(portalDir, 'index.html');
    if (await fs.pathExists(indexPath)) {
        let content = await fs.readFile(indexPath, 'utf8');
        
        // Add portal-specific meta tags
        if (!content.includes('portal-optimized')) {
            content = content.replace(
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                `<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="portal-optimized" content="true">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://myl.zip">`
            );
            await fs.writeFile(indexPath, content);
        }
    }
}

buildPortal();
