#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Biteship Custom Node untuk n8n...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
    console.error('❌ Node.js version 16 atau lebih tinggi diperlukan!');
    console.error(`   Current version: ${nodeVersion}`);
    process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
} catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
}

// Build project
console.log('\n🔨 Building project...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Project built successfully');
} catch (error) {
    console.error('❌ Failed to build project');
    process.exit(1);
}

// Check if dist folder exists
if (!fs.existsSync('./dist')) {
    console.error('❌ Dist folder not found after build');
    process.exit(1);
}

console.log('✅ Dist folder created');

// Create examples directory if not exists
if (!fs.existsSync('./examples')) {
    fs.mkdirSync('./examples');
    console.log('✅ Examples directory created');
}

// Success message
console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Dapatkan API key dari Biteship Dashboard');
console.log('2. Install node ke n8n instance Anda');
console.log('3. Setup credentials di n8n');
console.log('4. Import contoh workflow dari folder examples/');
console.log('\nDokumentasi lengkap tersedia di README.md dan INSTALLATION.md');
console.log('\n📋 Quick commands:');
console.log('  npm run dev     - Development mode dengan watch');
console.log('  npm run lint    - Check code quality');
console.log('  npm run format  - Format code');
console.log('\nHappy automating with Biteship! 🚚📦');
