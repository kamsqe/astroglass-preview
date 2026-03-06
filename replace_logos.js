import fs from 'fs';

const dirs = ['src/components/layout/header', 'src/components/sections/footer'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));
  
  files.forEach(file => {
    const filePath = `${dir}/${file}`;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern 1: <span class="logo-neo-icon"><svg>...</svg></span> 
    // Match the surrounding span/div and inner svg and replace entirely with <img ... />
    // Note: Some have <div class="logo-aurora-icon">
    content = content.replace(/<(span|div)\s+class="[^"]*logo[^"]*icon[^"]*"[^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/\1>/g, '<img src="/glass.svg" class="w-8 h-8 object-contain" alt="Logo" />');

    // Pattern 2: the <svg ... class="...logo-icon..."> itself directly without span
    content = content.replace(/<svg[^>]*class="[^"]*logo[^"]*icon[^"]*"[^>]*>[\s\S]*?<\/svg>/g, '<img src="/glass.svg" class="w-8 h-8 object-contain" alt="Logo" />');

    // Pattern 3: HeaderMinimal has <svg viewBox="0 0 24 24" ... class="w-8 h-8"> directly inside <LocalizedLink class="logo-minimal">
    // So if the string contains logo-minimal, let's find the nested svg. 
    // More safely, find `<svg ... class="w-8 h-8"...` next to `class="logo-minimal"`
    const minimalMatch = /class="logo-minimal"[^>]*>\s*<svg[^>]*class="[^"]*w-8 h-8[^"]*"[^>]*>[\s\S]*?<\/svg>/g;
    content = content.replace(minimalMatch, (match) => {
      return match.replace(/<svg[^>]*>[\s\S]*?<\/svg>/, '<img src="/glass.svg" class="w-8 h-8 object-contain" alt="Logo" />');
    });

    if (content !== original) {
      console.log(`Updated ${filePath}`);
      fs.writeFileSync(filePath, content);
    }
  });
});
