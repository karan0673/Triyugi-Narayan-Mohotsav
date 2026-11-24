#!/usr/bin/env node
/**
 * Installs dependencies at their latest stable versions (recorded in package.json and package-lock.json).
 * Run from the repo root:
 *   node scripts/install-deps.mjs            core dependencies (needed now)
 *   node scripts/install-deps.mjs --extras   later-phase dependencies (add when you need them)
 *   node scripts/install-deps.mjs --dry-run  print the commands without running them
 */
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const extras = args.includes('--extras');
const dryRun = args.includes('--dry-run');

const core = [
  { filter: '-w', dev: true, pkgs: ['turbo', 'typescript', 'prettier'] },

  // packages
  { filter: '@triyugi/shared', pkgs: ['zod', 'libphonenumber-js'] },
  { filter: '@triyugi/shared', dev: true, pkgs: ['typescript', 'vitest', '@types/node'] },
  { filter: '@triyugi/db', pkgs: ['mongoose'] },
  { filter: '@triyugi/db', dev: true, pkgs: ['typescript', '@types/node'] },
  { filter: '@triyugi/messaging', pkgs: ['resend'] },
  { filter: '@triyugi/messaging', dev: true, pkgs: ['typescript', '@types/node'] },

  // API (NestJS)
  {
    filter: '@triyugi/api',
    pkgs: [
      '@nestjs/common', '@nestjs/core', '@nestjs/platform-express', '@nestjs/config',
      '@nestjs/mongoose', '@nestjs/jwt', '@nestjs/throttler', 'mongoose', 'argon2',
      'cookie-parser', 'helmet', 'reflect-metadata', 'rxjs', 'zod',
    ],
  },
  {
    filter: '@triyugi/api',
    dev: true,
    pkgs: [
      '@nestjs/cli', '@nestjs/schematics', '@nestjs/testing', 'typescript', '@types/node',
      '@types/express', '@types/cookie-parser',
    ],
  },

  // Worker
  { filter: '@triyugi/worker', pkgs: ['mongoose'] },
  { filter: '@triyugi/worker', dev: true, pkgs: ['typescript', 'tsx', '@types/node'] },

  // Web (Next.js)
  {
    filter: '@triyugi/web',
    pkgs: [
      'next', 'react', 'react-dom', '@tanstack/react-query', 'react-hook-form',
      '@hookform/resolvers', 'zod', 'recharts', 'sonner', 'clsx', 'tailwind-merge',
      'class-variance-authority', 'lucide-react', 'date-fns',
    ],
  },
  {
    filter: '@triyugi/web',
    dev: true,
    pkgs: ['tailwindcss', '@tailwindcss/postcss', 'postcss', 'typescript', '@types/node', '@types/react', '@types/react-dom'],
  },
];

const later = [
  { filter: '@triyugi/web', pkgs: ['next-intl', '@tanstack/react-table', '@dnd-kit/core', '@dnd-kit/sortable'] },
  {
    filter: '@triyugi/api',
    pkgs: [
      '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner', '@aws-sdk/client-sqs',
      'exceljs', 'papaparse', 'pdfkit', '@sentry/node', 'nestjs-pino', 'pino', 'pino-http', '@nestjs/swagger',
    ],
  },
  {
    filter: '@triyugi/api',
    dev: true,
    pkgs: ['jest', 'ts-jest', '@types/jest', 'supertest', '@types/supertest', '@types/papaparse', '@types/pdfkit', 'mongodb-memory-server'],
  },
  { filter: '@triyugi/messaging', pkgs: ['@react-email/components', 'react-email'] },
  { filter: '-w', dev: true, pkgs: ['eslint', 'husky', 'lint-staged', '@playwright/test'] },
];

const plan = extras ? later : core;

// Turborepo needs the packageManager field. Record the npm version installed on this machine.
if (!dryRun) {
  const pkgPath = new URL('../package.json', import.meta.url);
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.packageManager) {
    const version = execSync('npm -v').toString().trim();
    pkg.packageManager = `npm@${version}`;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Set packageManager to npm@${version}`);
  }
}

for (const step of plan) {
  const cmd = ['npm', 'install'];
  if (step.dev) cmd.push('-D');
  if (step.filter !== '-w') cmd.push('-w', step.filter);
  cmd.push(...step.pkgs);
  console.log(`\n> ${cmd.join(' ')}`);
  if (dryRun) continue;
  const result = spawnSync(cmd.join(' '), { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error(`\nFailed: ${cmd.join(' ')}\nFix the error above, then run this script again.`);
    process.exit(result.status ?? 1);
  }
}

console.log(
  dryRun
    ? '\nDry run finished.'
    : '\nDone. Next: npm run build',
);
