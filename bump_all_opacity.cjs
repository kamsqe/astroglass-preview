const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.astro') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Bump all common text opacities that might fail contrast to 80
      let newContent = content
        .replace(/text-base-content\/30/g, 'text-base-content/80')
        .replace(/text-base-content\/40/g, 'text-base-content/80')
        .replace(/text-base-content\/50/g, 'text-base-content/80')
        .replace(/text-base-content\/60/g, 'text-base-content/80');

      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}
processDir(path.join(__dirname, 'src', 'components'));
processDir(path.join(__dirname, 'src', 'layouts'));
