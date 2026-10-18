import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📦 [Samjhao] Starting full production build for Vercel...');

// 1. Install client dependencies if needed
try {
  execSync('npm --prefix client install', { stdio: 'inherit' });
} catch (e) {
  console.warn('npm install client warning:', e.message);
}

// 2. Build Vite Client Bundle
execSync('npm --prefix client run build', { stdio: 'inherit' });

// 3. Mirror client/dist into root dist/ so Vercel finds ./dist seamlessly
const clientDist = path.resolve('client/dist');
const rootDist = path.resolve('dist');

if (fs.existsSync(clientDist)) {
  fs.mkdirSync(rootDist, { recursive: true });
  fs.cpSync(clientDist, rootDist, { recursive: true });
  console.log('✅ [Samjhao] Successfully mirrored client/dist -> ./dist for Vercel deployment!');
} else {
  console.error('❌ [Samjhao] client/dist was not found after build!');
  process.exit(1);
}
