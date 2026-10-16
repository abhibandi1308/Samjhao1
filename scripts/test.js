import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('🧪 Running Samjhao Full Test Suite (Server + Client)...\n');

console.log('👉 [1/2] Running Backend Tests...');
const serverTest = spawnSync(`${npmCmd} run test`, {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit',
  shell: true
});

if (serverTest.status !== 0) {
  console.error('\n❌ Server tests failed!');
  process.exit(serverTest.status || 1);
}

console.log('\n👉 [2/2] Running Frontend Client Logic Tests...');
const clientTest = spawnSync(`${npmCmd} run test`, {
  cwd: path.join(rootDir, 'client'),
  stdio: 'inherit',
  shell: true
});

if (clientTest.status !== 0) {
  console.error('\n❌ Client tests failed!');
  process.exit(clientTest.status || 1);
}

console.log('\n✅ All 12 Samjhao tests passed successfully!\n');
