import { spawnSync } from 'node:child_process';

for (const [label, command, args] of [
  ['tests', process.execPath, ['--test', 'tests/*.test.mjs']],
  ['build', process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build']],
]) {
  const shell = label === 'tests';
  const result = spawnSync(command, args, { stdio: 'inherit', shell });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('CDE viewer verification passed.');
