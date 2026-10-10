const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Auto-detect virtual environment Python or fallback to system Python
let pythonCmd = 'python';
const winVenv = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
const unixVenv = path.join(__dirname, 'venv', 'bin', 'python');

if (fs.existsSync(winVenv)) {
  pythonCmd = winVenv;
} else if (fs.existsSync(unixVenv)) {
  pythonCmd = unixVenv;
}

const proc = spawn(pythonCmd, ['run.py'], {
  cwd: __dirname,
  stdio: 'inherit'
});

proc.on('error', (err) => {
  console.error('Error starting backend server:', err.message);
  process.exit(1);
});

proc.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => {
  proc.kill('SIGINT');
});

process.on('SIGTERM', () => {
  proc.kill('SIGTERM');
});
