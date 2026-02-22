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
      if (content.includes('text-base-content/60')) {
        let newContent = content.replace(/text-base-content\/60/g, 'text-base-content/75');
        // also catch hover states
        newContent = newContent.replace(/group-hover:text-base-content\/60/g, 'group-hover:text-base-content/75');
        newContent = newContent.replace(/hover:text-base-content\/60/g, 'hover:text-base-content/75');
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

const componentsDir = path.join(__dirname, 'src', 'components');
processDir(componentsDir);

// Also process layouts and pages if necessary
const layoutsDir = path.join(__dirname, 'src', 'layouts');
if(fs.existsSync(layoutsDir)) {
    processDir(layoutsDir);
}
console.log('Opacity replacement complete.');
