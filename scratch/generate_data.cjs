const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio');
const dataFilePath = path.join(__dirname, '..', 'src', 'data.ts');

if (!fs.existsSync(portfolioDir)) {
  console.error('Portfolio directory not found at:', portfolioDir);
  process.exit(1);
}

// Helper to clean folder names for category display
function getCleanCategoryName(folderName) {
  let cleaned = folderName
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const customNames = {
    'E Commerce Modul Invigorate': 'E-Commerce Module',
    'Festival post 2025': 'Festival Post 2025',
    'Hire invigorate services Page': 'Hire Services Page',
    'Linkedin Post': 'LinkedIn Post',
    'Mobile E Commerce Modul invigorate': 'Mobile E-Commerce Module',
    'Mobile Hire Invigorated banner': 'Mobile Hire Banner',
    'Vaishali LinkedIn post': 'LinkedIn Post (Vaishali)',
    'Vaishali LinkedIn  post': 'LinkedIn Post (Vaishali)',
    'invigotared site banner': 'Site Banner',
    'mobile size invigortaed site banner': 'Mobile Site Banner',
    'normal page': 'Normal Page'
  };

  return customNames[cleaned] || cleaned;
}

const folders = fs.readdirSync(portfolioDir).filter(f => {
  return fs.statSync(path.join(portfolioDir, f)).isDirectory();
});

folders.sort((a, b) => a.localeCompare(b));

const items = [];
let idCounter = 1;

folders.forEach(folder => {
  const folderPath = path.join(portfolioDir, folder);
  const files = fs.readdirSync(folderPath).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
  });

  files.sort((a, b) => a.localeCompare(b));

  const categoryName = getCleanCategoryName(folder);
  const categoryKey = folder.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  files.forEach(file => {
    const title = path.basename(file, path.extname(file));
    items.push({
      id: idCounter++,
      title: title,
      category: categoryKey,
      categoryName: categoryName,
      subtitle: categoryName,
      image: `/portfolio/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`
    });
  });
});

console.log(`Found ${folders.length} categories and ${items.length} items.`);

if (!fs.existsSync(dataFilePath)) {
  console.error('data.ts not found at:', dataFilePath);
  process.exit(1);
}

const originalContent = fs.readFileSync(dataFilePath, 'utf8');
const portfolioItemsStartIdx = originalContent.indexOf('export const portfolioItems');

if (portfolioItemsStartIdx === -1) {
  console.error('Could not find portfolioItems declaration in data.ts');
  process.exit(1);
}

const beforePortfolio = originalContent.substring(0, portfolioItemsStartIdx);

const newPortfolioSection = `export const portfolioItems: PortfolioItem[] = ${JSON.stringify(items, null, 2)};

// Helper mapping for items that match multiple filters
export function doesItemMatchCategory(item: PortfolioItem, filter: string): boolean {
  if (filter === "all") return true;
  return item.category === filter;
}
`;

const finalContent = beforePortfolio + newPortfolioSection;
fs.writeFileSync(dataFilePath, finalContent, 'utf8');
console.log('Successfully updated src/data.ts!');
