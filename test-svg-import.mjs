import fs from 'fs';
const content = fs.readFileSync('public/glass.svg', 'utf8');
console.log(content.slice(0, 200));
console.log("Black count: " + (content.match(/#000000/g) || []).length);
console.log("White count: " + (content.match(/#ffffff/g) || []).length);
