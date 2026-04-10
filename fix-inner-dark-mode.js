import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

function replaceInDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // BACKGROUNDS
            content = content.replace(/\bbg-white(?! dark:bg-)/g, 'bg-white dark:bg-slate-800');
            // Inner backgrounds like headers, footers
            content = content.replace(/\bbg-slate-50(?! dark:bg-)(?! flex)/g, 'bg-slate-50 dark:bg-slate-800/50');
            content = content.replace(/\bbg-slate-100(?! dark:bg-)/g, 'bg-slate-100 dark:bg-slate-700');
            content = content.replace(/\bbg-slate-200(?! dark:bg-)/g, 'bg-slate-200 dark:bg-slate-600');

            // TEXT COLORS
            content = content.replace(/\btext-slate-900(?! dark:text-)/g, 'text-slate-900 dark:text-white');
            content = content.replace(/\btext-slate-800(?! dark:text-)/g, 'text-slate-800 dark:text-slate-100');
            content = content.replace(/\btext-slate-700(?! dark:text-)/g, 'text-slate-700 dark:text-slate-200');
            content = content.replace(/\btext-slate-600(?! dark:text-)/g, 'text-slate-600 dark:text-slate-300');
            content = content.replace(/\btext-slate-500(?! dark:text-)/g, 'text-slate-500 dark:text-slate-400');
            content = content.replace(/\btext-slate-400(?! dark:text-)/g, 'text-slate-400 dark:text-slate-500');

            // BORDERS
            content = content.replace(/\bborder-slate-100(?! dark:border-)/g, 'border-slate-100 dark:border-slate-700');
            content = content.replace(/\bborder-slate-200(?! dark:border-)/g, 'border-slate-200 dark:border-slate-600');
            content = content.replace(/\bborder-slate-300(?! dark:border-)/g, 'border-slate-300 dark:border-slate-600');

            // DIVIDERS OR STROKES (for SVGs/Recharts, etc, wait, Recharts uses props for stroke, so let's carefully not break things)
            content = content.replace(/\bdivide-slate-100(?! dark:divide-)/g, 'divide-slate-100 dark:divide-slate-700');
            content = content.replace(/\bdivide-slate-200(?! dark:divide-)/g, 'divide-slate-200 dark:divide-slate-700');

            // Prevent double classes if the script matches something twice strangely
            // content = content.replace(/dark:bg-slate-800 dark:bg-slate-800/g, 'dark:bg-slate-800');

            // Specially handling inputs and selects without hardcoded bg (just border)
            content = content.replace(/focus:ring-blue-100(?! dark:focus:ring-)/g, 'focus:ring-blue-100 dark:focus:ring-blue-900/50');
            
            // Adding transition everywhere makes it smooth
            content = content.replace(/className="((?!.*transition-all|.*transition-colors)[^"]*)"/g, 'className="$1 transition-colors"');
            
            // Clean up: avoid text-slate-800 dark:text-slate-100 text-slate-800
            // Regex replaces don't usually create this unless it matches twice, but since we used negative lookaheads (?! dark:bg-), it won't duplicate.

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated classes in ${fullPath}`);
            }
        }
    }
}

replaceInDir(pagesDir);
replaceInDir(componentsDir);
