const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// A 1x1 transparent PNG as placeholder until they upload real icons
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(base64Png, 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), buffer);
console.log("Placeholder icons created");
