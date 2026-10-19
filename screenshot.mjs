// Full-page screenshot: node screenshot.mjs <url> [label] [width]
import { createRequire } from 'node:module';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('C:/Users/sahad/AppData/Local/Temp/puppeteer-test/');
const puppeteer = require('puppeteer-core');

const [url = 'http://localhost:3000', label, width = '1440'] = process.argv.slice(2);
const dir = join(fileURLToPath(new URL('.', import.meta.url)), 'temporary screenshots');
await mkdir(dir, { recursive: true });

const nums = (await readdir(dir))
  .map((f) => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const out = join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1500)); // let entrance animation settle
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
