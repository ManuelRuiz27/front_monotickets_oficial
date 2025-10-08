#!/usr/bin/env node

const { spawn } = require('node:child_process');
const path = require('node:path');

/**
 * Simple orchestrator that boots the production Next.js servers for each app
 * within a single container. Every instance runs on the port defined in the
 * environment (with sensible defaults) and we relay stdout/stderr so Docker
 * logs stay readable. If any process exits, the container shuts down cleanly.
 */

const apps = [
  { name: 'admin', label: 'Admin', portVar: 'ADMIN_PORT', defaultPort: '3000' },
  { name: 'staff', label: 'Staff', portVar: 'STAFF_PORT', defaultPort: '3001' },
  { name: 'guest', label: 'Guest', portVar: 'GUEST_PORT', defaultPort: '3002' },
  { name: 'superadmin', label: 'Super Admin', portVar: 'SUPERADMIN_PORT', defaultPort: '3003' },
];

const children = new Map();
let shuttingDown = false;

const shutdown = (signalOrCode) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children.values()) {
    child.kill('SIGTERM');
  }
  // Give the processes a moment to shut down gracefully before forcing exit.
  setTimeout(() => process.exit(typeof signalOrCode === 'number' ? signalOrCode : 0), 500);
};

for (const app of apps) {
  const port = process.env[app.portVar] || app.defaultPort;
  const appDir = path.join(__dirname, '..', 'apps', app.name);
  const nextBin = path.join(appDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn('node', [nextBin, 'start', '-p', port, '-H', '0.0.0.0'], {
    env: { ...process.env, PORT: port, HOST: '0.0.0.0', NODE_ENV: 'production' },
    stdio: 'inherit',
    cwd: appDir,
  });

  children.set(app.name, child);

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      console.error(`[${app.label}] proceso terminado (${signal ?? code}). Apagando contenedor…`);
      shutdown(code ?? 1);
    }
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
