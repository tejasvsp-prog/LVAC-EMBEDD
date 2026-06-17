import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = 'file://' + path.join(__dirname, 'flyer.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 3 });
await page.goto(htmlPath, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

// High-res PNG
await page.locator('.page').screenshot({ path: path.join(__dirname, 'out/snaggletooth-volunteer-flyer.png') });

// Print-ready PDF (US Letter, backgrounds on)
await page.pdf({
  path: path.join(__dirname, 'out/snaggletooth-volunteer-flyer.pdf'),
  width: '816px', height: '1056px', printBackground: true, pageRanges: '1'
});

await browser.close();
console.log('rendered PNG + PDF');
