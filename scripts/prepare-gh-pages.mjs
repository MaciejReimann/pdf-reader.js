#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const genericDir = path.join(buildDir, 'generic');
const ghPagesDir = path.join(buildDir, 'gh-pages');
const pdfReaderBuildDir = path.join(buildDir, 'pdf-reader');

console.log('🚀 Preparing GitHub Pages deployment...');

// Clean and create gh-pages directory
if (fs.existsSync(ghPagesDir)) {
    fs.rmSync(ghPagesDir, { recursive: true, force: true });
}
fs.mkdirSync(ghPagesDir, { recursive: true });

// Copy generic build files
console.log('📁 Copying generic build files...');
if (fs.existsSync(genericDir)) {
    copyDir(genericDir, ghPagesDir);
} else {
    console.error('❌ Generic build not found. Run "npm run build" first.');
    process.exit(1);
}

// Copy pdf-reader build files
console.log('📁 Copying pdf-reader build files...');
if (fs.existsSync(pdfReaderBuildDir)) {
    const targetPdfReaderDir = path.join(ghPagesDir, 'build', 'pdf-reader');
    fs.mkdirSync(targetPdfReaderDir, { recursive: true });
    copyDir(pdfReaderBuildDir, targetPdfReaderDir);
} else {
    console.error('❌ PDF Reader build not found. Run "npm run build" first.');
    process.exit(1);
}

// Copy viewer.html as index.html
console.log('📝 Setting up viewer.html as main page...');
const viewerPath = path.join(ghPagesDir, 'web', 'viewer.html');
const indexPath = path.join(ghPagesDir, 'index.html');

if (fs.existsSync(viewerPath)) {
    fs.copyFileSync(viewerPath, indexPath);
    console.log('✅ Created index.html from viewer.html');
} else {
    console.error('❌ viewer.html not found in build output');
    process.exit(1);
}

// Create a simple README for GitHub Pages
const readmePath = path.join(ghPagesDir, 'README.md');
const readmeContent = `# PDF.js Enhanced Viewer

This is a custom build of PDF.js with enhanced reading capabilities.

## Features

- Enhanced PDF reading experience
- Custom audio and text processing
- Built on top of Mozilla's PDF.js

## Usage

Visit the [live demo](https://yourusername.github.io/pdf-reader.js) to use the enhanced PDF viewer.

## Source

Based on [Mozilla PDF.js](https://github.com/mozilla/pdf.js) with custom enhancements.
`;

fs.writeFileSync(readmePath, readmeContent);

console.log('✅ GitHub Pages preparation complete!');
console.log(`📦 Files ready in: ${ghPagesDir}`);
console.log('🌐 Next steps:');
console.log('   1. Commit and push to your repository');
console.log('   2. Enable GitHub Pages in repository settings');
console.log('   3. Set source to "gh-pages" branch or "build/gh-pages" folder');

function copyDir(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
