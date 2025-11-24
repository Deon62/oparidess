/**
 * Cleanup script to remove react-native-maps cache and clear Metro bundler cache
 * Run: node scripts/cleanup-cache.js
 */

const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(__dirname, '../node_modules');
const expoPath = path.join(__dirname, '../.expo');

console.log('🧹 Cleaning up caches...\n');

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

// Clear .expo cache
if (fs.existsSync(expoPath)) {
  try {
    fs.rmSync(expoPath, { recursive: true, force: true });
    console.log('✅ Removed .expo cache');
  } catch (err) {
    console.log(`⚠️  Could not remove .expo: ${err.message}`);
  }
}

console.log('\n✨ Cleanup complete!');
console.log('💡 Now run: npx expo start --clear');

