const fs = require('fs');
const path = require('path');

console.log('[v0] Aggressive rebuild: Clearing all build caches...');

// Remove .next directory
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('[v0] ✓ Deleted .next directory');
}

// Remove .turbo directory  
const turboDir = path.join(process.cwd(), '.turbo');
if (fs.existsSync(turboDir)) {
  fs.rmSync(turboDir, { recursive: true, force: true });
  console.log('[v0] ✓ Deleted .turbo directory');
}

// Remove node_modules/.cache if exists
const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('[v0] ✓ Deleted node_modules/.cache');
}

console.log('[v0] ✓ All caches cleared');
console.log('[v0] Dev server will perform full rebuild on next browser refresh');
