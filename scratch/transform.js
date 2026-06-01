const fs = require('fs');
const path = require('path');

const filePaths = [
    'd:/dev/UNIQUE WORK/kidraw/src/features/landing/components/LandingPage.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/features/dashboard/components/DashboardView.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/auth/signin/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/billing/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/blog/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/changelog/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/community/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/developers-api/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/features/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/help-center/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/integrations/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/templates/page.tsx',
    'd:/dev/UNIQUE WORK/kidraw/src/app/info/[slug]/page.tsx'
];

// Helper to replace with regex
function replace(content, pattern, replacement) {
    return content.replace(pattern, replacement);
}

for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filePath} - not found`);
        continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. LandingPage specific: Replace local navbar with GlobalNavbar
    if (filePath.includes('LandingPage.tsx')) {
        if (!content.includes('import GlobalNavbar')) {
            content = content.replace(
                "import KidrawLogo from '@/shared/components/KidrawLogo';",
                "import GlobalNavbar from '@/shared/components/GlobalNavbar';"
            );
        }
        
        // Remove the local <nav> entirely
        const navRegex = /\{\/\*\s*───\s*NAVBAR\s*───\s*\*\/\}\s*<nav[\s\S]*?<\/nav>/g;
        content = content.replace(navRegex, "{/* ─── NAVBAR ─── */}\n            <GlobalNavbar />");

        // Masked grid in Landing Page
        content = content.replace(
            /bg-\[linear-gradient\(to_right,#ffffff0a_1px,transparent_1px\),linear-gradient\(to_bottom,#ffffff0a_1px,transparent_1px\)\]/g,
            "bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        );
    }

    // Common semantic replacements
    // Backgrounds
    content = content.replace(/bg-black(?![/A-Za-z0-9\-])/g, 'bg-background');
    content = content.replace(/bg-black\/(\d+)/g, 'bg-background/$1');
    content = content.replace(/bg-zinc-950/g, 'bg-card');
    content = content.replace(/bg-zinc-900\/(\d+)/g, 'bg-card');
    content = content.replace(/bg-zinc-900/g, 'bg-card');
    content = content.replace(/bg-zinc-800/g, 'bg-accent');
    content = content.replace(/bg-white\/5/g, 'bg-secondary/50');
    
    // Text colors
    content = content.replace(/text-slate-50/g, 'text-foreground');
    content = content.replace(/text-white(?![/A-Za-z0-9\-])/g, 'text-foreground');
    content = content.replace(/text-zinc-400/g, 'text-muted-foreground');
    content = content.replace(/text-zinc-500/g, 'text-muted-foreground');
    content = content.replace(/text-zinc-300/g, 'text-muted-foreground');
    content = content.replace(/text-slate-300/g, 'text-muted-foreground');
    content = content.replace(/text-slate-400/g, 'text-muted-foreground');
    content = content.replace(/from-white/g, 'from-foreground');
    content = content.replace(/via-white/g, 'via-foreground');
    content = content.replace(/to-white\/(\d+)/g, 'to-foreground/$1');

    // Borders
    content = content.replace(/border-white\/10/g, 'border-border');
    content = content.replace(/border-white\/5/g, 'border-border');
    content = content.replace(/border-zinc-800/g, 'border-border');
    content = content.replace(/border-zinc-700/g, 'border-border');
    
    // Hover states
    content = content.replace(/hover:bg-white\/10/g, 'hover:bg-accent');
    content = content.replace(/hover:text-white/g, 'hover:text-foreground');
    content = content.replace(/hover:bg-zinc-800/g, 'hover:bg-accent hover:text-accent-foreground');
    content = content.replace(/hover:bg-zinc-900/g, 'hover:bg-accent');

    // Info page specific masked grid
    content = content.replace(
        /bg-\[linear-gradient\(to_right,#ffffff0a_1px,transparent_1px\),linear-gradient\(to_bottom,#ffffff0a_1px,transparent_1px\)\]/g,
        "bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${filePath}`);
}

console.log("Transformation complete.");
