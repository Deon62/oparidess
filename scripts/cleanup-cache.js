/**
 * Comprehensive cleanup script to clear all Expo and Metro bundler caches
 * Run: node scripts/cleanup-cache.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const nodeModulesPath = path.join(rootDir, 'node_modules');
const expoPath = path.join(rootDir, '.expo');
const metroCachePath = path.join(rootDir, '.metro');
const watchmanPath = path.join(rootDir, '.watchman');
const tempPath = path.join(rootDir, '.tmp');

console.log('🧹 Cleaning up all caches...\n');

// Helper function to safely remove directories
function removeDir(dirPath, name) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Removed ${name}`);
      return true;
    } catch (err) {
      console.log(`⚠️  Could not remove ${name}: ${err.message}`);
      return false;
    }
  }
  return false;
}

// Clear .expo cache (Expo's build cache)
removeDir(expoPath, '.expo cache');

// Clear Metro bundler cache
removeDir(metroCachePath, 'Metro cache');

// Clear Watchman cache (if exists)
removeDir(watchmanPath, 'Watchman cache');

// Clear temp files
removeDir(tempPath, 'Temp files');

// Remove react-native-maps cache folders
if (fs.existsSync(nodeModulesPath)) {
  try {
    const items = fs.readdirSync(nodeModulesPath);
    items.forEach(item => {
      if (item.startsWith('.react-native-maps')) {
        const fullPath = path.join(nodeModulesPath, item);
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`✅ Removed: ${item}`);
        } catch (err) {
          console.log(`⚠️  Could not remove: ${item} - ${err.message}`);
        }
      }
    });
  } catch (err) {
    console.log(`⚠️  Error reading node_modules: ${err.message}`);
  }
}

// Clear npm cache (optional, but can help)
try {
  console.log('\n🔄 Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ npm cache cleared');
} catch (err) {
  console.log(`⚠️  Could not clear npm cache: ${err.message}`);
}

// Try to clear Watchman (if installed)
try {
  console.log('\n🔄 Clearing Watchman cache...');
  execSync('watchman watch-del-all', { stdio: 'ignore', cwd: rootDir });
  console.log('✅ Watchman cache cleared');
} catch (err) {
  // Watchman might not be installed, that's okay
  console.log('ℹ️  Watchman not found or not installed (this is okay)');
}

console.log('\n✨ Cleanup complete!');
console.log('💡 Now run: npm run start (or npx expo start --clear)');

