const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Minimal valid PNG with a rich blue color
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMr9sHwAAAABJRU5ErkJggg==';
const iconBuffer = Buffer.from(base64Png, 'base64');

[
  'icon-16.png',
  'icon-32.png',
  'icon-48.png',
  'icon-64.png',
  'icon-128.png',
  'icon-256.png',
  'icon-512.png',
  'favicon.ico'
].forEach((file) => {
  fs.writeFileSync(path.join(iconDir, file), iconBuffer);
});

console.log('Icons generated successfully.');
