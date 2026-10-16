import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('🚀 Starting Samjhao Development Environment (Client + Server)...\n');

const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit',
  shell: true
});

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'client'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down Samjhao dev processes...');
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
