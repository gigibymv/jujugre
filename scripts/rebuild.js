#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✓ Removed: ${dirPath}`);
  }
}

// Clear Next.js build cache
console.log('Clearing build caches...');
removeDirectory(path.join(__dirname, '../.next'));
removeDirectory(path.join(__dirname, '../node_modules/.cache'));
removeDirectory(path.join(__dirname, '../.turbo'));

console.log('✓ Build cache cleared successfully.');
console.log('✓ Dev server will rebuild on next request.');
