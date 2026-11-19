// Render the site's real Geist fonts and a distinct teal, gold, and ivory wash.
// Run with: node scripts/generate-social-preview.mjs
// CHROME_PATH can point to a Chromium executable on other machines.
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const temp = await mkdtemp(join(tmpdir(), 'felix-social-preview-'));
try {
  let html = await readFile(join(root, 'scripts/social-preview.html'), 'utf8');
  for (const [token, font] of [
    ['__SANS__', 'geist-sans/Geist-Regular.woff2'],
    ['__SERIF__', 'geist-serif/GeistSerif-Regular.woff2'],
  ]) {
    const data = await readFile(join(root, 'node_modules/geist/dist/fonts', font));
    html = html.replace(token, `data:font/woff2;base64,${data.toString('base64')}`);
  }
  const source = join(temp, 'preview.html');
  const screenshot = join(temp, 'preview.png');
  await writeFile(source, html);
  execFileSync(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless', '--disable-gpu', '--no-pdf-header-footer', '--hide-scrollbars',
    `--user-data-dir=${join(temp, 'chrome')}`, '--window-size=1200,630',
    '--force-device-scale-factor=1', '--virtual-time-budget=3000',
    `--screenshot=${screenshot}`, pathToFileURL(source).href,
  ], { stdio: 'pipe', timeout: 30000 });
  await sharp(screenshot).png().toFile(join(root, 'public/social-preview.png'));
  console.log('Created public/social-preview.png (1200 × 630).');
} finally {
  await rm(temp, { recursive: true, force: true });
}
