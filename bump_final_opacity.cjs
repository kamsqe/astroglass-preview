const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.astro') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Increase specific opacities for better contrast
      
      // Footer copyright
      if (fullPath.includes('Footer') && content.includes('text-base-content/60')) {
        content = content.replace(/text-base-content\/60/g, 'text-base-content/80');
        modified = true;
      }
      
      // HowItWorks and CTAs terminal text & features
      if (fullPath.includes('HowItWorks') || fullPath.includes('CTA')) {
         if (content.includes('text-base-content/60')) {
             content = content.replace(/text-base-content\/60/g, 'text-base-content/80');
             modified = true;
         }
         // specific target for terminal if we need it solid
         if (content.includes('text-base-content/50')) {
             content = content.replace(/text-base-content\/50/g, 'text-base-content/80');
             modified = true;
         }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

const componentsDir = path.join(__dirname, 'src', 'components');
processDir(componentsDir);

console.log('Opacity bump complete.');
