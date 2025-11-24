/**
 * Image Optimization Script
 * Run this before building to compress images
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * Note: This requires sharp to be installed
 * Install: npm install --save-dev sharp
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');
const maxSizeKB = {
  'car': 200,
  'logo': 50,
  'profile': 100,
  'payment': 20
};

console.log('📦 Image Optimization Check');
console.log('============================\n');

function getFileSizeInKB(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / 1024;
}

function checkImages(dir, subdir = '') {
  const fullPath = path.join(dir, subdir);
  const files = fs.readdirSync(fullPath);

  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      checkImages(dir, path.join(subdir, file));
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const sizeKB = getFileSizeInKB(filePath);
      const relativePath = path.join(subdir, file);
      
      let maxSize = maxSizeKB.car;
      if (file.includes('logo')) maxSize = maxSizeKB.logo;
      else if (file.includes('profile')) maxSize = maxSizeKB.profile;
      else if (['mpesa', 'airtel', 'visa', 'mastercard'].some(p => file.toLowerCase().includes(p))) {
        maxSize = maxSizeKB.payment;
      }

      const status = sizeKB > maxSize ? '❌ TOO LARGE' : '✅ OK';
      console.log(`${status} ${relativePath}: ${sizeKB.toFixed(2)} KB (max: ${maxSize} KB)`);
      
      if (sizeKB > maxSize) {
        console.log(`   ⚠️  Consider compressing this image using TinyPNG or similar tool\n`);
      }
    }
  });
}

checkImages(assetsDir);
console.log('\n💡 Tip: Use online tools like TinyPNG.com or Squoosh.app to compress images');
console.log('💡 Or install imagemin: npm install -g imagemin-cli imagemin-jpeg-recompress imagemin-pngquant');

