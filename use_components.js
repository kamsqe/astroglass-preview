import fs from 'fs';

const dirs = ['src/components/layout/header', 'src/components/sections/footer'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));
  
  files.forEach(file => {
    const filePath = `${dir}/${file}`;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We want to replace `<img src="/glass.svg" class="... object-contain" alt="Logo" />`
    // OR any similar `<img src="/glass.svg" class="...">`
    // with `<Logo showText={false} />`
    
    // Check if we need to add the import statement
    const needsImport = /<img\s+src="\/glass\.svg"[^>]*>/i.test(content) || /<img\s+src="\/glass\.svg"[^>]*\/>/i.test(content);
    
    if (needsImport) {
        // Strip out the img
        content = content.replace(/<img\s+src="\/glass\.svg"[^>]*>/i, '<Logo showText={false} />');
        content = content.replace(/<img\s+src="\/glass\.svg"[^>]*\/>/i, '<Logo showText={false} />');
        
        // Add import if it doesn't exist
        if (!content.includes("import Logo from")) {
            // we have to figure out the right relative path.
            // from src/components/layout/header -> ../../ui/Logo.astro
            // from src/components/sections/footer -> ../../ui/Logo.astro
            const importStatement = "import Logo from '../../ui/Logo.astro';\n";
            // Insert it under the imports block
            content = content.replace(/(import\s+[^;]+;)/, `$1\n${importStatement}`);
        }
    }

    if (content !== original) {
      console.log(`Updated ${filePath}`);
      fs.writeFileSync(filePath, content);
    }
  });
});
