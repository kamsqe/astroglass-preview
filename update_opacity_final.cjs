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

      // 1. Footer Copyright
      if (fullPath.includes('Footer') && content.includes('text-base-content/30')) {
        content = content.replace(/text-base-content\/30/g, 'text-base-content/60');
        modified = true;
      }

      // 2. Testimonial Roles
      if (fullPath.includes('Testimonial') && content.includes('text-base-content/75')) {
        content = content.replace(/text-base-content\/75/g, 'text-base-content');
        modified = true;
      }
      if (fullPath.includes('Testimonial') && content.includes('text-base-content/60')) {
          content = content.replace(/text-base-content\/60/g, 'text-base-content');
          modified = true;
      }

      // 3. CTA Terminals
      if ((fullPath.includes('CTA') || fullPath.includes('HowItWorks')) && content.includes('text-base-content/30')) {
        content = content.replace(/text-base-content\/30/g, 'text-base-content/60');
        modified = true;
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

console.log('Opacity replacement complete.');
