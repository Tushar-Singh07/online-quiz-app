import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // For instances with "min-h-screen bg-slate-50 flex" or similar
            const replacements = [
                {
                    from: /min-h-screen bg-slate-50 flex/g,
                    to: 'min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200'
                },
                {
                    from: /min-h-screen flex bg-slate-50/g,
                    to: 'min-h-screen flex bg-slate-50 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200'
                },
                {
                    from: /min-h-screen bg-slate-50 flex items-center/g,
                    to: 'min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex items-center transition-colors duration-200'
                },
                {
                    from: /min-h-screen bg-slate-50 p-8/g,
                    to: 'min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 p-8 transition-colors duration-200'
                },
                {
                    from: /min-h-screen flex bg-white/g,
                    to: 'min-h-screen flex bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200'
                },
                {
                    from: /min-h-screen bg-slate-100 flex/g,
                    to: 'min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200'
                }
            ];

            for (const r of replacements) {
                if (r.from.test(content)) {
                    content = content.replace(r.from, r.to);
                    modified = true;
                }
            }

            // Let's also fix background class in Dashboard
            if (content.includes('bg-white') && (fullPath.includes('Dashboard') || fullPath.includes('Analytics'))) {
                content = content.replace(/bg-white rounded/g, 'bg-white dark:bg-slate-800 rounded');
                content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInDir(pagesDir);
